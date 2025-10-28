import {Router} from "express";
import {authenticate} from "./auth.js";

import {FlowNode} from "../db/mongoDb/models/flowNode.model.js";

const router = Router()

router.get('/byChatbotId/:chatbotId', (req, res) => {
	// console.log(req.params.chatbotId)
	FlowNode.findByChatbotId(req.params.chatbotId)
			.then((flowNodes) => {
				// console.log(flowNodes)

				res.send({message: flowNodes})
			})
			.catch((err) => {
				// console.log(err)
				res.send({message: err})
			})
})

export default Router()
		.use('/node', authenticate, router)
		.use('/nodes', authenticate, Router()
				.patch('/', async (req, res) => {
					const promises = []

					req.body.forEach((node) => {
						promises.push(FlowNode.updateOne({_id: node._id}, node))
					})

					await Promise.all(promises)
					
					res.send({message: 'ok'})

				}))
