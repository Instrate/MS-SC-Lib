import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { ServicesModule } from "./services/services.module";
import { LoggerSchema } from "./services/logger/logger.schema";
import { NestFactory } from "@nestjs/core";

@Module({
	imports: [ServicesModule],
	providers: [AppService],
})
export class AppModule {
	static EnvData: LoggerSchema;

	constructor(private readonly service: AppService) {
		AppModule.EnvData = this.service.schema.env;
	}

	static async CreateApp() {
		return NestFactory.create(AppModule);
	}
}
