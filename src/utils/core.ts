type GenericObject = { [key: string]: any };

export function mergeObjects<T extends GenericObject>(target: T, source: T): T {
	const result: GenericObject = {...target};

	for (const key in source) {
		if (source.hasOwnProperty(key)) {
			if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
				if (typeof result[key] === 'object' && result[key] !== null) {
					result[key] = mergeObjects(result[key], source[key]);
				} else {
					result[key] = {...source[key]};
				}
			} else {
				result[key] = source[key];
			}
		}
	}

	return result as T;
}

import {v1} from 'uuid'

export class Defer<T> {
	resolve!: (value: T) => void
	reject!: (reject?: unknown) => void

	id = v1()

	promise: Promise<T>

	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve
			this.reject = reject
		});

		// Freeze the Defer instance to prevent modification of its properties.
		// This ensures the resolve, reject, and promise properties remain immutable after construction.
		Object.freeze(this);
	}
}