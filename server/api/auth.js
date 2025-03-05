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
    
    console.log("userToken:", userToken); // Todo: Remove log
    

    if (userToken) {
        const decoded = tokenDecode(userToken);

        if (decoded) {
            return User.findById(decoded.userId).then((r)=> {return r}).catch((e) => console.log(r))
        }
    }

    return;
}