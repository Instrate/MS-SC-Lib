import { Injectable } from "@nestjs/common";
import { EventsHandlerService } from "../events-handler/events-handler.service";
import { IDatedLog, ILoggedMessage } from "./logger.interface";
import { EventLogger } from "./logger.event";
import {
	EnumLoggedDataType,
	EnumLoggerStreamType,
	EnumLoggingLevel,
} from "./logger.enum";
import { EnumTextModifiers, RemoveTextModifiers } from "../../constants/text";
import { TMessageFormatted } from "./logger.type";
import { LoggedDataTypeList, LoggerOutputFolder } from "./logger.constant";
import { FormatDate, GetCurrentDate } from "../../functions/date";
import { Highlight } from "../../functions/text";
import { EnvService } from "../env/env.service";
import {
	LoggerFormatCluster,
	LoggerFormatDate,
	LoggerFormatModule,
} from "./logger.format";
import * as fs from "fs";
import * as path from "path";
import { LoggerConfiguration } from "../../config/logger";

@Injectable()
export class LoggerService {
	static verbose(data: ILoggedMessage) {
		LoggerService.WriteLog(EnumLoggingLevel.VERBOSE, data);
	}

	static debug(data: ILoggedMessage) {
		LoggerService.WriteLog(EnumLoggingLevel.DEBUG, data);
	}

	static information(data: ILoggedMessage) {
		LoggerService.WriteLog(EnumLoggingLevel.INFORMATION, data);
	}

	static warning(data: ILoggedMessage) {
		LoggerService.WriteLog(EnumLoggingLevel.WARNING, data);
	}

	static error(data: ILoggedMessage) {
		LoggerService.WriteLog(EnumLoggingLevel.ERROR, data);
	}

	static fatal(data: ILoggedMessage) {
		LoggerService.WriteLog(EnumLoggingLevel.FATAL, data);
	}

	static WriteLog(level: EnumLoggingLevel, data: ILoggedMessage) {
		const { moduleName, clusterTag, stream, active, message, sensitivity } =
			data;

		if (
			Object.values(EnumLoggingLevel).indexOf(data.sensitivity) >
			Object.values(EnumLoggingLevel).indexOf(level)
		) {
			return;
		}

		if (!message?.length || !active) {
			return;
		}

		const date = GetCurrentDate();

		const has_plain_stream = [
			EnumLoggerStreamType.FILE,
			EnumLoggerStreamType.FILE_CONSOLE,
			EnumLoggerStreamType.FILE_EXTERNAL,
			EnumLoggerStreamType.ALL,
		].includes(stream);

		const formattedMessage = this.FormatLog(
			{
				moduleName,
				message,
				clusterTag,
				date: FormatDate(
					date,
					EnvService.Ref.properties.LOGGING_DATA_DATE_FORMAT,
				),
				sensitivity: level,
			},
			has_plain_stream,
		);

		if (formattedMessage.has_plain_stream) {
			EventsHandlerService.GlobalRef.emit(
				EventLogger.WRITE.FILE,
				formattedMessage.plain,
				date,
			);
		}

		if (
			[
				EnumLoggerStreamType.CONSOLE,
				EnumLoggerStreamType.CONSOLE_EXTERNAL,
				EnumLoggerStreamType.FILE_CONSOLE,
				EnumLoggerStreamType.ALL,
			].includes(stream)
		) {
			EventsHandlerService.GlobalRef.emit(
				EventLogger.WRITE.CONSOLE,
				formattedMessage.modified,
			);
		}

		if (
			[
				EnumLoggerStreamType.EXTERNAL,
				EnumLoggerStreamType.FILE_EXTERNAL,
				EnumLoggerStreamType.CONSOLE_EXTERNAL,
				EnumLoggerStreamType.ALL,
			].includes(stream)
		) {
			//TODO: add hub call
			return;
			//...
		}
	}

	static AssignLoggerEvents() {
		EventsHandlerService.AssignGlobalEvents([
			{
				event: EventLogger.VERBOSE,
				callback: this.verbose,
			},
			{
				event: EventLogger.DEBUG,
				callback: this.debug,
			},
			{
				event: EventLogger.INFORMATION,
				callback: this.information,
			},
			{
				event: EventLogger.WARNING,
				callback: this.warning,
			},
			{
				event: EventLogger.ERROR,
				callback: this.error,
			},
			{
				event: EventLogger.FATAL,
				callback: this.fatal,
			},
			{
				event: EventLogger.WRITE.CONSOLE,
				callback: this._writeConsole,
			},
			{
				event: EventLogger.WRITE.FILE,
				callback: this._writeFile,
			},
		]);
	}

	static GetFormatSensitivityLevel(level: EnumLoggingLevel) {
		switch (level) {
			case EnumLoggingLevel.VERBOSE:
				return [EnumTextModifiers.Bright];
			case EnumLoggingLevel.INFORMATION:
				return [EnumTextModifiers.FgGreen];
			case EnumLoggingLevel.DEBUG:
				return [EnumTextModifiers.FgCyan];
			case EnumLoggingLevel.WARNING:
				return [EnumTextModifiers.BgWhite, EnumTextModifiers.FgRed];
			case EnumLoggingLevel.ERROR:
				return [EnumTextModifiers.BgBlack, EnumTextModifiers.FgRed];
			case EnumLoggingLevel.FATAL:
				return [EnumTextModifiers.BgRed, EnumTextModifiers.FgWhite];
		}
	}

	static FormatLog(
		data: IDatedLog,
		has_plain_stream: boolean,
	): TMessageFormatted {
		const { moduleName, message, clusterTag, date, sensitivity } = data;
		const result: TMessageFormatted = has_plain_stream
			? {
					modified: EnvService.Ref.properties.LOGGING_DATA_FORMAT,
					plain: EnvService.Ref.properties.LOGGING_DATA_FORMAT,
					has_plain_stream,
				}
			: {
					modified: EnvService.Ref.properties.LOGGING_DATA_FORMAT,
					has_plain_stream,
				};

		for (const i in LoggedDataTypeList) {
			const type = LoggedDataTypeList[i];
			if (!result.modified.includes(type)) {
				continue;
			}
			let insertion_modified: string;
			let insertion_plain: string = "";
			switch (type) {
				case EnumLoggedDataType.Data:
					{
						insertion_modified = message;
						if (result.has_plain_stream) {
							insertion_plain = RemoveTextModifiers(message);
						}
					}
					break;
				case EnumLoggedDataType.Module:
					{
						insertion_modified = Highlight(
							(insertion_plain = moduleName),
							...LoggerFormatModule,
						);
					}
					break;
				case EnumLoggedDataType.Date:
					{
						insertion_modified = Highlight(
							(insertion_plain = date.toString()),
							...LoggerFormatDate,
						);
					}
					break;
				case EnumLoggedDataType.Level:
					{
						insertion_modified = Highlight(
							(insertion_plain = sensitivity.toUpperCase()),
							...this.GetFormatSensitivityLevel(sensitivity),
						);
					}
					break;
				case EnumLoggedDataType.Cluster:
					{
						insertion_modified = Highlight(
							(insertion_plain = clusterTag),
							...LoggerFormatCluster,
						);
					}
					break;
				default: {
					insertion_modified = insertion_plain = "";
				}
			}
			result.modified = result.modified.split(type).join(insertion_modified);
			if (result.has_plain_stream) {
				result.plain = result.plain.split(type).join(insertion_plain);
			}
		}
		return result;
	}

	private static _writeFile(message: string, date: Date) {
		const inlog_folder = FormatDate(date, "yyyy-MM-dd");
		const folder = path.join(LoggerOutputFolder, inlog_folder);
		if (!fs.existsSync(folder)) {
			fs.mkdirSync(folder, { recursive: true });
		}
		const dir = fs
			.readdirSync(folder)
			.filter((val) => val.includes(LoggerConfiguration["file-ext"]));
		let file = "";
		if (dir.length) {
			const last = path.join(folder, dir[dir.length - 1]);
			if (fs.statSync(last).size > LoggerConfiguration["max-file-size"]) {
				file = path.join(
					folder,
					`${dir.length}.${LoggerConfiguration["file-ext"]}`,
				);
			} else {
				file = last;
			}
		} else {
			file = path.join(folder, `1.${LoggerConfiguration["file-ext"]}`);
		}
		fs.appendFileSync(file, message + "\r\n", { flag: "a+" });
	}

	private static _writeConsole(message: string) {
		console.log(message + EnumTextModifiers.Reset);
	}
}
