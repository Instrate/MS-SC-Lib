import { format } from "date-fns";
import { LOCALE_DEFAULT, TIMEZONE_DEFAULT } from "../constants/date";

export function FormatDate(date: Date, date_format: string) {
	return format(date, date_format);
}

export function GetCurrentDate() {
	return new Date(
		new Date().toLocaleString(LOCALE_DEFAULT, { timeZone: TIMEZONE_DEFAULT }),
	);
}
