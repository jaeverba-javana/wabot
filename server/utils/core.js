/**
 * Extends the properties of the primary object with the properties of the secondary object.
 *
 * @template T - The type of the primary object.
 * @template U - The type of the secondary object.
 * @param {T} primary - The primary object to be extended.
 * @param {U} secondary - The secondary object whose properties will be added to the primary object.
 * @returns {T & U} - The extended object containing properties from both primary and secondary objects.
 */
export function extend(primary, secondary) {
    /** @type {T} */
    const r = primary

    for (const secondaryKey in secondary) {
        Object.defineProperty(r, secondaryKey, Object.getOwnPropertyDescriptor(secondary, secondaryKey))
    }

    /** @type {T&U} */
    return r
}

/**
 * Merges multiple objects into one, combining their properties.
 * In case of overlapping properties, later objects in the arguments overwrite earlier ones.
 *
 * @template T - The type of the objects being merged.
 * @param {...Partial<T>} objects - A rest parameter of objects to be merged.
 * @returns {T} A new object that is the result of merging all input objects.
 */
export function mergeObjects(target, source) {
	const result = {...target};

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

	return result;
}