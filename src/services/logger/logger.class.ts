import { Injectable, LoggerService } from "@nestjs/common";
import { EnumLoggingLevel } from "./logger.enum";
import { LoggedUnit } from "./logger.unit";
import { Highlight } from "../../functions/text";
import { FormatDate, GetCurrentDate } from "../../functions/date";
import { LoggerDataDateFormatDefault } from "./logger.constant";
import { LoggerFormatDate } from "./logger.format";
import { LoggerService as Service } from "./logger.service";

/**
 * (deprecated)
 */
@Injectable()
export class LoggerClass extends LoggedUnit implements LoggerService {
	constructor() {
		super();
	}

	log(message: unknown, ...optionalParams: unknown[]) {
		this._write(message, EnumLoggingLevel.INFORMATION, optionalParams);
	}

	fatal(message: unknown, ...optionalParams: unknown[]) {
		this._write(message, EnumLoggingLevel.FATAL, optionalParams);
	}

	error(message: unknown, ...optionalParams: unknown[]) {
		this._write(message, EnumLoggingLevel.ERROR, optionalParams);
	}

	warn(message: unknown, ...optionalParams: unknown[]) {
		this._write(message, EnumLoggingLevel.WARNING, optionalParams);
	}

	debug?(message: unknown, ...optionalParams: unknown[]) {
		this._write(message, EnumLoggingLevel.DEBUG, optionalParams);
	}

	verbose?(message: unknown, ...optionalParams: unknown[]) {
		this._write(message, EnumLoggingLevel.VERBOSE, optionalParams);
	}

	private _write(
		message: unknown,
		level: EnumLoggingLevel,
		...optionalParams: unknown[]
	) {
		const date = FormatDate(GetCurrentDate(), LoggerDataDateFormatDefault);
		const msg = Service.FormatLog(
			{
				date: FormatDate(GetCurrentDate(), LoggerDataDateFormatDefault),
				message: message as string,
				moduleName: this.constructor.name,
				clusterTag: this.clusterTag,
				sensitivity: level,
			},
			false,
		);
		console.log(`${Highlight(date, ...LoggerFormatDate)}`);
		console.log(message, level, optionalParams);
	}
}
