import { Module } from "@nestjs/common";
import { LoggerModule } from "./logger/logger.module";
import { EventsHandlerModule } from "./events-handler/events-handler.module";

const ModuleSet = [LoggerModule, EventsHandlerModule];

@Module({
	imports: ModuleSet,
	exports: ModuleSet,
})
export class ServicesModule {}
