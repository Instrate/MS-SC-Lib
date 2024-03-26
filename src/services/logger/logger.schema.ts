import {
	Contains,
	IsEnum,
	IsNotEmpty,
	IsString,
	ValidateIf,
} from "class-validator";
import { EnumLoggedDataType, EnumLoggingLevel } from "./logger.enum";
import { ILoggerParameters } from "./logger.interface";
import {
	LOGGER_MODULE_OUTPUT_STREAM_DEFAULT,
	LoggerDataDateFormatDefault,
	LoggerDataFormatDefault,
	LoggerSensitivityLevelDefault,
} from "./logger.constant";

export class LoggerSchema implements ILoggerParameters {
	@IsEnum(EnumLoggingLevel)
	@ValidateIf((val) => !!val?.length)
	LOGGING_LOWEST_LEVEL: string = LoggerSensitivityLevelDefault;

	@Contains(EnumLoggedDataType.Data)
	@IsString()
	@ValidateIf((val) => !!val?.length)
	LOGGING_DATA_FORMAT: string = LoggerDataFormatDefault;

	@IsNotEmpty()
	@IsString()
	@ValidateIf((val) => !!val?.length)
	LOGGING_DATA_DATE_FORMAT: string = LoggerDataDateFormatDefault;

	@IsNotEmpty()
	@IsString()
	@ValidateIf((val) => !!val?.length)
	LOGGING_STREAM_PATH: string = LOGGER_MODULE_OUTPUT_STREAM_DEFAULT;
}
