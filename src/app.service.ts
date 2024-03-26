import { Injectable } from "@nestjs/common";
import { LoggedUnit } from "./services/logger/logger.unit";
import { AppSchema } from "./app.schema";
import { LoggerSchema } from "./services/logger/logger.schema";

@Injectable()
export class AppService extends LoggedUnit {
	public readonly schema: AppSchema<LoggerSchema>;

	constructor() {
		super();
		this.schema = new AppSchema<LoggerSchema>(LoggerSchema, new LoggerSchema());
	}
}
