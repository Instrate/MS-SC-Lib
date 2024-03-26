import { EventEmitter2 } from "@nestjs/event-emitter";

export const EVENTS_DELIMITER = ".";

export const EVENT_EMITTER_OPTIONS_DEFAULT = {
	delimiter: EVENTS_DELIMITER,
	verboseMemoryLeak: true,
};

export const EVENT_EMITTER_GLOBAL = new EventEmitter2(
	EVENT_EMITTER_OPTIONS_DEFAULT,
);
