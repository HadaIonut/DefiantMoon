import { rtFetch } from "./fetchOverRTC";
import { parse } from "dice-parsering-library";
import { RolledDamageEntry, TraitAction } from "src/types/Actors";
import { ParseResultType } from "dice-parsering-library/dist/types";

const rollTraitAction = (trait: TraitAction): string => {
	return JSON.stringify({
		description: trait.description,
		complexRoll: true,
		toHit: parse(trait.toHit),
		damage: trait.damage.reduce(
			(acc, cur) => [
				...acc,
				{
					roll: parse(cur.roll),
					damageType: cur.damageType,
				},
			],
			[] as RolledDamageEntry[],
		),
		other: trait.other.reduce(
			(acc, cur) => [...acc, parse(cur)],
			[] as ParseResultType[],
		),
	});
};

const handleMaybeHTML = (message: string) => {
	const tempHTML = document.createElement("div");
	tempHTML.innerHTML = message;
	const body = tempHTML.querySelector("p");
	return body?.innerText ?? message;
};

const rollTheDice = (message: string) => {
	const parsedDice = parse(handleMaybeHTML(message)); // TODO: Simple objects instered into chat are removed from HTML, fix

	if (parsedDice.original === parsedDice.parsed) return parsedDice.original;
	return JSON.stringify(parsedDice);
};

export const sendHTMLMessage = async (message: string, images: File[] = []) => {
	await sendChatMessage(rollTheDice(message), images);
};

export const sendTraitMessage = async (message: TraitAction) => {
	await sendChatMessage(rollTraitAction(message), []);
};

export const sendSimpleDiceRoll = async (
	diceExpression: string,
	description: string = "",
) => {
	await sendChatMessage(
		JSON.stringify({
			...parse(`/r ${diceExpression}`),
			description,
		}),
		[],
	);
};

export const sendChatMessage = async (message: string, images: File[]) => {
	await rtFetch({
		route: "/api/chat/messages",
		method: "POST",
		contentType: "multipart/form-data",
		body: {
			message: message,
			images,
		},
	});
};
