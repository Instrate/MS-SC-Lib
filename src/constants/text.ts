import { Highlight } from "../functions/text";
import { GetEnumStringValues } from "../functions/object";

export enum EnumTextModifiers {
	Reset = "\x1b[0m",
	Bright = "\x1b[1m",
	Dim = "\x1b[2m",
	Underscore = "\x1b[4m",
	Blink = "\x1b[5m",
	Reverse = "\x1b[7m",
	Hidden = "\x1b[8m",

	FgBlack = "\x1b[30m",
	FgRed = "\x1b[31m",
	FgGreen = "\x1b[32m",
	FgYellow = "\x1b[33m",
	FgBlue = "\x1b[34m",
	FgMagenta = "\x1b[35m",
	FgCyan = "\x1b[36m",
	FgWhite = "\x1b[37m",

	BgBlack = "\x1b[40m",
	BgRed = "\x1b[41m",
	BgGreen = "\x1b[42m",
	BgYellow = "\x1b[43m",
	BgBlue = "\x1b[44m",
	BgMagenta = "\x1b[45m",
	BgCyan = "\x1b[46m",
	BgWhite = "\x1b[47m",
}

export const TextModifiers = GetEnumStringValues(
	EnumTextModifiers,
	1,
	"string",
);

export const HighlightedQuotes = Highlight(
	"'",
	EnumTextModifiers.FgCyan,
	EnumTextModifiers.Bright,
);

export function PrettifyObjectToString(obj: object) {
	const entries = Object.entries(obj);
	let res: string = "{\n";
	for (const [key, value] of entries) {
		res += `\t"${Highlight(key, EnumTextModifiers.FgYellow, EnumTextModifiers.Bright)}": ${JSON.stringify(value).replaceAll("'", HighlightedQuotes)}\n`;
	}
	return res + "}";
}

export function RemoveTextModifiers(text: string): string {
	for (const ind in TextModifiers) {
		const mod = TextModifiers[ind];
		const split = text.split(mod);
		if (split.length === 1) {
			continue;
		}
		text = split.join("");
	}
	return text;
}
