import {Router} from "express";
import {authenticate} from "./auth.js";
import {userController, chatBotController} from './../controller/index.js'


const router = Router({
	strict: true,
})

router.get('/accountInfo', async (req, res) => {
	// const {email, phoneId} = req.body
	const user = userController.clean(req.user)
	const chatbot = await chatBotController.get(user._id)

	// console.log(chatBot)

	res.send({message: {user, chatbot}})
})

export default Router().use('/fetch', authenticate, router)