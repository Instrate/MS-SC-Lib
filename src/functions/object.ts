export function GetEnumStringValues(
	obj: object,
	entry_index: number = 0,
	expectedType: "string" | "number" = "string",
) {
	return Object.entries(obj)
		.map((val) => val[entry_index])
		.filter((val) => typeof val === expectedType);
}
