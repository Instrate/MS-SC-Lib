export interface IEventWrapped {
	event: string;
	callback: (..._: unknown[]) => void;
}
