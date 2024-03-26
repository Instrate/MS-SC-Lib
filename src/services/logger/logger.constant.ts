import {
	EnumLoggedDataType,
	EnumLoggerStreamType,
	EnumLoggingLevel,
} from "./logger.enum";
import { GetEnumStringValues } from "../../functions/object";
import * as cluster from "cluster";
import * as process from "process";
import * as path from "path";
import { LoggerConfiguration } from "../../config/logger";
import { AppFolder } from "../../constants/app";

export const LOGGER_CLUSTER_TAG = `${cluster.default.isPrimary ? "Primary" : "Worker"}#${process.pid}`;

export const LOGGER_MODULE_NAME_DEFAULT = "unknown" as const;

export const LOGGER_MODULE_OUTPUT_STREAM_DEFAULT = EnumLoggerStreamType.ALL;

export const LOGGER_MODULE_DO_LOGGING_DEFAULT: boolean = true;

export const LOGGER_MODULE_LEVEL_DEFAULT: EnumLoggingLevel =
	EnumLoggingLevel.VERBOSE;

export const LoggedDataTypeList = GetEnumStringValues(EnumLoggedDataType).map(
	(val) => val.toLowerCase(),
);

export const LoggerDataFormatDefault = "[date]|cluster|{module}(level): data";

export const LoggerDataDateFormatDefault = "HH:mm:ss";

export const LoggerStreamPathDefault = "Logs";

export const LoggerSensitivityLevelDefault: EnumLoggingLevel =
	EnumLoggingLevel.VERBOSE;

export const LoggingLevels: string[] = GetEnumStringValues(
	EnumLoggingLevel,
	1,
	"string",
);

export const LoggerOutputFolder = path.join(
	AppFolder,
	LoggerConfiguration["output-folder"],
);
