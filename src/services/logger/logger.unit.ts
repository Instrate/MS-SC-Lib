import { ILoggedMessage, ILoggedUnit } from "./logger.interface";
import { EnumLoggerStreamType, EnumLoggingLevel } from "./logger.enum";
import { EventLogger } from "./logger.event";
import { PrettifyObjectToString } from "../../constants/text";
import {
	LOGGER_CLUSTER_TAG,
	LOGGER_MODULE_DO_LOGGING_DEFAULT,
	LOGGER_MODULE_LEVEL_DEFAULT,
	LOGGER_MODULE_OUTPUT_STREAM_DEFAULT,
} from "./logger.constant";
import { EventsHandlerService } from "../events-handler/events-handler.service";

export class LoggedUnit implements ILoggedUnit {
	readonly moduleName: string;
	readonly clusterTag: string = LOGGER_CLUSTER_TAG;
	readonly stream: EnumLoggerStreamType = LOGGER_MODULE_OUTPUT_STREAM_DEFAULT;
	readonly active: boolean = LOGGER_MODULE_DO_LOGGING_DEFAULT;
	readonly sensitivity: EnumLoggingLevel = LOGGER_MODULE_LEVEL_DEFAULT;

	//TODO: add custom settings to constructor
	constructor() {
		this.moduleName = this.constructor.name;
		// if (custom_settings) {
		// 	const keys = Object.keys(this);
		// 	const entries: [[key: keyof LoggedUnit, value: unknown]] =
		// 		Object.entries(custom_settings);
		// 	for (const [setting, value] of entries) {
		// 		if (keys.includes(setting)) {
		// 			(this as LoggedUnit)[setting] = value;
		// 		}
		// 	}
		// }
	}

	LogVerbose<TMessage = object | string>(message?: TMessage) {
		return this._LogEvent(EventLogger.VERBOSE, message);
	}

	LogInformation<TMessage = object | string>(message?: TMessage) {
		return this._LogEvent(EventLogger.INFORMATION, message);
	}

	LogDebug<TMessage = object | string>(message?: TMessage) {
		return this._LogEvent(EventLogger.DEBUG, message);
	}

	LogWarning<TMessage = object | string>(message?: TMessage) {
		return this._LogEvent(EventLogger.WARNING, message);
	}

	LogError<TMessage = object | string>(message?: TMessage) {
		return this._LogEvent(EventLogger.ERROR, message);
	}

	LogFatal<TMessage = object | string>(message?: TMessage) {
		return this._LogEvent(EventLogger.FATAL, message);
	}

	private _LogEvent<TMessage = object | string>(
		event: string,
		data?: TMessage,
	) {
		if (!data) {
			return false;
		}
		let message: string;
		if (typeof data === "string") {
			message = data;
		} else {
			message = PrettifyObjectToString(data);
		}
		const loggedMessage: ILoggedMessage = {
			stream: this.stream,
			active: this.active,
			moduleName: this.moduleName,
			clusterTag: this.clusterTag,
			sensitivity: this.sensitivity,
			message,
		};
		return EventsHandlerService.GlobalRef.emit(event, loggedMessage);
	}
}
