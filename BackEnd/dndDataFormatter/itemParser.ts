import { classes, getEmptyAbilityMap, propertyTypeConversionMap } from "./constants/constants.ts";
import { abilityModifiers, armorAC, Item, itemBonuses, multiRange, shapeRange, simpleRange, weaponProprieties } from "./types/Items.d.ts";
import { OrigianlItem, OriginalEntries, OriginalItemAbilityModifier, OriginalPropertiesType } from "./types/OriginalItems.d.ts";

export const parseItemDescription = (entries: OriginalEntries[]): string => {
    let out = "";

    entries.forEach((entry: OriginalEntries | string) => {
        if (typeof entry === "string") {
            out += entry;
        } else if (entry.entries) {
            out += parseItemDescription(entry.entries as OriginalEntries[]);
        }
    });

    return out;
};

export const extractItemRange = (item: OrigianlItem): simpleRange | multiRange | shapeRange | null => {
    if (item?.range) {
        const [low, high] = item.range.split("/");
        return {
            low: Number(low),
            high: Number(high),
            unit: "feet",
        } as multiRange;
    } else if (item?.weapon) {
        return {
            value: 5,
            unit: "feet",
        };
    }

    return null;
};

export const extractDamage = (item: OrigianlItem): string[] => {
    const out = [];

    if (item.dmg1) out.push(item.dmg1);
    if (item.dmg2) out.push(item.dmg2);

    return out;
};

export const parseAttunementRequirements = (attunement: boolean | string): string[] => {
    if (typeof attunement === "boolean") return [];
    const out: string[] = [];

    classes.forEach((className: string) => {
        if (attunement.includes(className)) out.push(className);
    });

    return out;
};

export const parseItemArmor = (item: OrigianlItem): armorAC | null => {
    if (!item?.ac) return null;

    if (typeof item.ac === "string") return null;

    return {
        value: item.ac,
        condtion: null,
        value2: null,
    };
};

export const parseItemBonuses = (item: OrigianlItem): itemBonuses => {
    return {
        ac: item?.bonusAC ?? "",
        weaponAll: item?.bonusWeapon ?? "",
        weaponAttack: item?.bonusWeaponAttack ?? "",
        weaponDamage: item?.bonusWeaponDamage ?? "",
        spellAttack: item?.bonusSpellAttack ?? "",
        spellDamage: "",
        savingThrow: item.bonusSavingThrow ?? "",
    };
};

export const parseItemProperties = (properties: OriginalPropertiesType[]): weaponProprieties[] => {
    const result: weaponProprieties[] = [];

    properties.forEach((property: OriginalPropertiesType) => {
        result.push(propertyTypeConversionMap[property]);
    });

    return result;
};

export const parseAbilityModifiers = (
    itemModifier: OriginalItemAbilityModifier
): {
    abilityModifiers: abilityModifiers;
    abilityOverrides: abilityModifiers;
} => {
    const abilityModifiers = getEmptyAbilityMap();
    const abilityOverrides = getEmptyAbilityMap();

    Object.keys(abilityModifiers).forEach((key: string) => {
        if (itemModifier[key as keyof abilityModifiers]) {
            //@ts-ignore gets confused from the stupid structure provided
            abilityModifiers[key as keyof abilityModifiers] = itemModifier[key as keyof OriginalItemAbilityModifier] ?? null;
        }
    });

    Object.keys(abilityOverrides).forEach((key: string) => {
        if (itemModifier?.static?.[key as keyof abilityModifiers]) {
            abilityOverrides[key as keyof abilityModifiers] = itemModifier.static[key as keyof abilityModifiers] ?? null;
        }
    });

    return {
        abilityModifiers,
        abilityOverrides,
    };
};

export const isDexWeapon = (item: Item): boolean => {
    return !!((item.range as multiRange)?.low && (item.range as multiRange)?.high);
};

export const createItemAction = (item: Item): string => {
    if (!item.isWeapon) return "";
    let actionText = "";
    const isDex = isDexWeapon(item);

    actionText += "To hit: ";
    actionText += `/r 1d20 + ${isDex ? "@dex" : "@str"}`;

    if (item.damage) {
        actionText += "\nDamage: ";
        actionText += `/r ${item.damage[0]} + ${isDex ? "@dex" : "@str"}`;
    }

    return actionText;
};
