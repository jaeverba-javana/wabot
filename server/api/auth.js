import { log } from "console";
import { User } from "./../db/mongoDb/models/userModel.js";
import { tokenDecode } from "./../utils/token.js";


export const authenticate = async (req, res, next) => {
    const user = await isAuthenticated(req);

    if (user) {
        req.user = user;
        next()
    } else {
        res.status(4.4).end()
    }
}

export const notAuthenticated = async (req, res, next) => {
    const user = await isAuthenticated(req)

    if (user) {
        req.user = user
        res.status(403).end()
    } else {
        next()
    }
}

export const isAuthenticated = async (req) => {
    const userToken = req.cookies["SESSION_TOKEN"];

    // console.log('sessionToken:', userToken)

    if (userToken) {
        const decoded = tokenDecode(userToken);
        // console.log('decoded:', decoded)

        if (decoded) {
            return await User.findById(decoded.userId)
                .catch((e) => console.log(r))
        }
    }
}