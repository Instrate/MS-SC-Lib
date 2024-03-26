export function Route(
	parent: string,
	child: string | number,
	separator: string = "/",
) {
	return `${parent}${separator}${typeof child === "string" ? child : child.toString()}`;
}
