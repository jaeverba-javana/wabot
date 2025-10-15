import {Router} from "express";

const router = Router({
    strict: true
});

router.get("/", (req, res) => {
    let user

    if (req.user) {
        user = {}
        Object.getOwnPropertyNames(req.user._doc).forEach(i => {
            if (!['password'].includes(i))
            user[i] = req.user[i]
        })
    }

    res.send({message: user})
})

export default router