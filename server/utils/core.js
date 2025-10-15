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