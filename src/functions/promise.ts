// export async function AlignNestedBuilderChain<T>(
// 	...calls: [func: (...params: unknown[]) => Promise<T>, ...args: unknown[]][]
// ) {
// 	for (const [func, params] of calls) {
// 		console.log(func, params);
// 		await func(params);
// 	}
// }
