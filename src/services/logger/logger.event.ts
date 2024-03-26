import { EnumLoggingLevel } from "./logger.enum";
import { Route } from "../../functions/route";

class EventWriteLogger {
	public readonly CONSOLE: string;
	public readonly FILE: string;
	public readonly CLUSTER: string;

	constructor(public readonly SELF: string) {
		this.CONSOLE = Route(SELF, "console");
		this.CLUSTER = Route(SELF, "cluster");
		this.FILE = Route(SELF, "file");
	}
}

export class EventLogger {
	static readonly SELF = "logger";

	static readonly VERBOSE = Route(EventLogger.SELF, EnumLoggingLevel.VERBOSE);
	static readonly INFORMATION = Route(
		EventLogger.SELF,
		EnumLoggingLevel.INFORMATION,
	);
	static readonly DEBUG = Route(EventLogger.SELF, EnumLoggingLevel.DEBUG);
	static readonly WARNING = Route(EventLogger.SELF, EnumLoggingLevel.WARNING);
	static readonly ERROR = Route(EventLogger.SELF, EnumLoggingLevel.ERROR);
	static readonly FATAL = Route(EventLogger.SELF, EnumLoggingLevel.FATAL);

	static readonly WRITE = new EventWriteLogger(
		Route(EventLogger.SELF, "write"),
	);
}
