import { EnumTextModifiers } from "../constants/text";

export function Highlight(text: string, ...modifications: EnumTextModifiers[]) {
	if (!modifications?.length) {
		return text;
	}
	return modifications.join().replace(",", "") + text + EnumTextModifiers.Reset;
}
