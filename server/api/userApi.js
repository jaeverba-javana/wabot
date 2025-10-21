import {Router} from "express";
import {authenticate} from "./auth.js";
import {wabaApi} from "../utils/axios.js";
import {userController} from './../controller/index.js'

const router = Router({
	strict: true
});

router.get("/", (req, res) => {
	let user = userController.clean(req.user);

	res.send({message: {user}})
})

router.put("/", async (req, res) => {
	try {
		if (!req.user || !req.body.phoneId) {
			return res.status(400).send({message: "Missing required data"})
		}

		const {data: wabaResponse} = await wabaApi(
				req.body.phoneId,
				process.env.WHATSAPP_TOKEN
		).get("")

		console.log(wabaResponse)

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

export default Router().use("/user", authenticate, router)