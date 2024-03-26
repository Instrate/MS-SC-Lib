import { LoggerService } from "./services/logger/logger.service";
import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

export class AppBuilder {
	private _app: INestApplication<unknown>;

	private static _PreInit() {
		LoggerService.AssignLoggerEvents();
	}

	async Create() {
		AppBuilder._PreInit();
		this._app = await NestFactory.create(AppModule);
		return this;
	}

	async Listen(port?: number) {
		await this._app.listen(port || 3000);
		return this;
	}
}
