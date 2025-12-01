import {Router} from "express";
import {authenticate} from "./auth.js";

import {FlowNodeModel} from "../db/mongoDb/models/index.js";

const router = Router()

router.get('/byChatbotId/:chatbotId', (req, res) => {
	// console.log(req.params.chatbotId)
	FlowNodeModel.findByChatbotId(req.params.chatbotId)
			.then((flowNodes) => {
				// console.log(flowNodes)

				res.send({message: flowNodes})
			})
			.catch((err) => {
				// console.log(err)
				res.send({message: err})
			})
})

router.patch('/', async (req, res) => {
	const r = await FlowNodeModel.updateOneSet({_id: req.body._id}, req.body)
	res.send({message: r})
})

router.post('/', async (req, res) => {
	const flowNode = new FlowNodeModel({
		...req.body
	})

	const savedFlowNode = await flowNode.save()

	res.send({message: 'ok', data: savedFlowNode})
})

export default Router()
		.use('/node', authenticate, router)
		.use('/nodes', authenticate, Router()
				.patch('/', async (req, res) => {
					const promises = []

					req.body.forEach((node) => {
						promises.push(
								new Promise((resolve, reject) => {
									const cos = {_id: node._id}
									FlowNodeModel.updateOne({_id: node._id}, node)
											.then((result) => {
												resolve({...cos, ...result})
											})
											.catch((err) => {
												reject({...cos, ...err})
											})
								})
						)
					})

					const statuses = await Promise.allSettled(promises)

					res.send({message: 'ok', data: statuses})

				}))
