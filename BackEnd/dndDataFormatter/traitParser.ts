import { attackShortHandMap, boldText } from "./constants/constants.ts";
import {
    LimitedUsage,
    limitedUsageRechargeAtDiceRoll,
    limitedUsageRechargeInTime,
    multiRange,
    shapeRange,
    shapeTypes,
    simpleRange,
    Trait,
} from "../database/schemas/Items.ts";
import { OriginalAttackType, OriginalMonster, OriginalTrait } from "./types/OriginalMonster.d.ts";

const getToHitRoll = (modifier: string): string => `[[1d20 + ${modifier}]]`;
const getDamageRoll = (roll: string): string => `[[${roll}]]`;

const parseRange = (entries: string[]): simpleRange | multiRange | shapeRange | null => {
    const mergedEntries = entries.join("\n");
    const matches = [
        ...mergedEntries.matchAll(
            /(?:reach|range)?\s?(\d+(?:\/\d+)?)(?:[ -])([\w.]+)\s?(sphere|cube|cone|line)?(?:\sthat is (\d) (\w+)? (?:wide))?/g
        ),
    ][0];

    if (!matches) return null;

    const range = matches[1];
    const width = matches[4];
    const unit = matches[2];
    const shape = matches[3];

    if (range.search(/(\d+\/\d+)/g) !== -1) {
        const splitted = range.split("/");

        return {
            low: Number(splitted[0]),
            high: Number(splitted[1]),
            unit: unit,
        } as multiRange;
    }

    if (shape) {
        let out = {};

        switch (shape) {
            case "shape":
                out = { radious: Number(range) };
                break;
            case "cube":
                out = { length: Number(range) };
                break;
            case "cone":
                out = { length: Number(range) };
                break;
            case "line":
                out = { length: Number(range), width: Number(width) };
                break;
        }

        return {
            shape: shape as shapeTypes,
            unit: unit,
            ...out,
        };
    }

    if (range) {
        return {
            value: Number(range),
            unit: unit,
        };
    }

    return null;
};

const extractDataFromTraitName = (name: string): [string, LimitedUsage | null] => {
    const splitted = [...name.matchAll(/([\w ]+)(?:\((\d+)\/(\w+)\)?\))?(?:{@recharge (\d)+})?\s?/g)][0];

    const hasDiceRecharge = !!splitted?.[4] ?? false;
    const hasDayRehcarge = !!splitted?.[3] ?? false;
    const hasLimitedUsage = hasDiceRecharge || hasDayRehcarge;
    let rechargeObject: limitedUsageRechargeInTime | limitedUsageRechargeAtDiceRoll | null = null;

    if (hasDiceRecharge) {
        rechargeObject = {
            diceValue: Number(splitted?.[4]),
            usages: 1,
            remainingUsages: 1,
        };
    } else if (hasDayRehcarge) {
        rechargeObject = {
            timeUnit: splitted?.[3],
            usages: Number(splitted[2]),
            remainingUsages: Number(splitted[2]),
        };
    }

    return [
        splitted?.[1] ?? "",
        hasLimitedUsage
            ? {
                  cost: 1,
                  recharge: rechargeObject,
              }
            : null,
    ];
};

export const extractAction = (entries: string[]): string => {
    const mergedEntries = entries.join("\n");
    let actionText = "";
    const toHitRolls = mergedEntries.match(/{@hit (\d+)}/);
    const damageRolls = [...mergedEntries.matchAll(/{@damage (.+?)}/g)];
    const otherDice = [...mergedEntries.matchAll(/{@dice (.+?)}/g)];

    if (toHitRolls?.[1]) {
        actionText += "To Hit: ";
        actionText += getToHitRoll(toHitRolls[1]);
    }

    if (damageRolls.length > 0) actionText += "\nDamage: ";
    damageRolls.forEach((damageRoll) => (actionText += getDamageRoll(damageRoll[1])));

    if (otherDice?.length > 0) actionText += "\nOther: ";
    otherDice.forEach((dice) => (actionText += getDamageRoll(dice[1])));

    return actionText;
};

export const parseDescription = (entries: string[]): string => {
    return entries
        .join("\n")
        .replace(/{@atk (\w+)}/g, (_, attackType: OriginalAttackType): string => attackShortHandMap[attackType] || attackType)
        .replace(/{@hit (\d+)}/g, (_, averageRoll: string): string => averageRoll)
        .replace(/{@h}(\d+)/g, (_, averageDamage: string): string => `Hit: ${averageDamage}`)
        .replace(/{@damage (.+?)}/g, (_, diceRoll: string): string => `[[${diceRoll}]]`)
        .replace(/{@dice (.+?)}/g, (_, diceRoll: string): string => `[[${diceRoll}]]`)
        .replace(/{@dc (.+?)}/g, (_, dc: string): string => boldText(dc));
};

const createTraitObject = (trait: OriginalTrait, isAction: boolean, isLegendary: boolean, isReaction: boolean): Trait => {
    const [traitName, limitedUsage] = extractDataFromTraitName(trait.name ?? "");

    return {
        name: traitName,
        limitedUsage,
        description: parseDescription(trait.entries),
        range: parseRange(trait.entries),
        action: extractAction(trait.entries),
        image: null,
        isAction,
        isLegendary,
        isReaction,
    };
};

export const parseMonsterTrait = (monster: OriginalMonster): Trait[] => {
    const out: Trait[] = [];

    monster.trait?.forEach((trait: OriginalTrait) => out.push(createTraitObject(trait, false, false, false)));
    monster.action?.forEach((trait: OriginalTrait) => out.push(createTraitObject(trait, true, false, false)));
    monster.reaction?.forEach((trait: OriginalTrait) => out.push(createTraitObject(trait, false, false, true)));
    monster.legendary?.forEach((trait: OriginalTrait) => out.push(createTraitObject(trait, true, true, false)));

    return out;
};
