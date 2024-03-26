import { EVENT_EMITTER_GLOBAL } from "./events-handler.constant";
import { IEventWrapped } from "./events-handler.interface";

export class EventsHandlerService {
	static readonly GlobalRef = EVENT_EMITTER_GLOBAL;

	static AssignGlobalEvents(eventsWrapped: IEventWrapped[]) {
		for (let i = 0; i < eventsWrapped.length; i++) {
			const { event, callback } = eventsWrapped[i];
			if (EVENT_EMITTER_GLOBAL.hasListeners(event)) {
				continue;
			}
			EventsHandlerService.GlobalRef.on(event, callback);
		}
	}
}
