export type TMessageFormatted = {
	modified: string;
	has_plain_stream: boolean;
} & (
	| { has_plain_stream: true; plain: string }
	| {
			has_plain_stream: false;
	  }
);
