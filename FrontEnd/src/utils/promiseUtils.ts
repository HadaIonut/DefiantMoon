export const spawnPromise = <T>(): [
	(value: T | PromiseLike<T>) => void,
	(reason?: any) => void,
	Promise<T>,
] => {
	let newResolve, newReject;
	const newPromise = new Promise<T>((resolve, reject) => {
		newResolve = resolve;
		newReject = reject;
	});

	return [
		newResolve as unknown as (value: T | PromiseLike<T>) => void,
		newReject as unknown as (reason?: any) => void,
		newPromise,
	];
};
