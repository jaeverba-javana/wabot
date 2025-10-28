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