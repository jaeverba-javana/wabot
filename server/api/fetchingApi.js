import {Router} from "express";
import {authenticate} from "./auth.js";
import {userController} from './../controller/index.js'
import {ChatbotModel} from "../db/mongoDb/models/index.js";
import mongoose from "mongoose";


const router = Router({
	strict: true,
})

router.get('/accountInfo', async (req, res) => {
	// const {email, phoneId} = req.body
	// const user = userController.clean(req.user)
	const chatbot = await ChatbotModel.findByUserId(req.user._id)

	console.log(`chatbot ${chatbot instanceof mongoose.Document? 'si' : 'no'} es un documento`)

	// console.log(chatBot)

	res.send({message: {user: req.user, chatbot}})
})

export default Router().use('/fetch', authenticate, router)