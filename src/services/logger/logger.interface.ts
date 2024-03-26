import { EnumLoggerStreamType, EnumLoggingLevel } from "./logger.enum";

export interface ILoggedUnitBase {
	moduleName: string;
	clusterTag: string;
	sensitivity: EnumLoggingLevel;
}

export interface IFormattedLog extends ILoggedUnitBase {
	message: string;
}

export interface ILoggedUnit extends ILoggedUnitBase {
	stream: EnumLoggerStreamType;
	active: boolean;
}

export interface ILoggedMessage extends ILoggedUnit {
	message: string;
}

export interface IDatedLog extends IFormattedLog {
	date: string | Date;
}

export interface IFormattedMessage {
	modified: string;
	plain?: string;
}

export interface ILoggerParameters {
	LOGGING_LOWEST_LEVEL: string | number;

	LOGGING_DATA_FORMAT: string;

	LOGGING_DATA_DATE_FORMAT: string;

	LOGGING_STREAM_PATH: string;
}
