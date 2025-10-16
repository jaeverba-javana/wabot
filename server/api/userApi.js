import {Router} from "express";
import {authenticate} from "./auth.js";

const router = Router({
    strict: true
});

router.get("/", (req, res) => {
    let user

    // console.log(req.user)

    if (req.user) {
        user = {}
        Object.getOwnPropertyNames(req.user._doc).forEach(i => {
            if (!['password'].includes(i))
            user[i] = req.user[i]
        })
    }

    res.send({message: user})
})

router.put("/", async (req, res) => {
    try {
        console.log(req.body)
        if (!req.user || !req.body.phoneId) {
            return res.status(400).send({message: "Missing required data"})
        }

        const user = await req.user.updateOne({phoneId: req.body.phoneId})
        if (!user) {
            return res.status(404).send({message: "User not found"})
        }

        res.send({message: "Phone ID updated successfully"})
    } catch (error) {
        console.error('Error updating phone ID:', error)
        res.status(500).send({message: "Error updating phone ID"})
    }
})

export default Router().use("/", authenticate, router)