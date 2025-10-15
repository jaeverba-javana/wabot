import jwt from 'jsonwebtoken'
import {extend} from "./core.js";

import {Buffer} from "node:buffer"

const sk = process.env.SECRET_TOKEN?? 'sckey';

/**
 * Generates a JSON Web Token (JWT) with the given payload and options.
 *
 * @param {Buffer | Object | String} payload  - The payload to be encoded in the JWT. It can be a string, object, or Buffer.
 * @param {SignOptions} options - Optional settings for the token generation. Defaults to an empty object.
 * @returns The generated JWT as a string.
 */
export function tokenGenerate(
    payload, options = {}
) {
    const _options = extend(
        {expiresIn: '1M'},
        options
    )

    return jwt.sign(payload, sk, _options) 
}

/**
 * @template T
 * @param {T} token
 * @returns {T|boolean}
 */
export function tokenDecode(token) {
    try {
       return jwt.verify(token, sk)
    } catch (_e) {
        return false
    }
}