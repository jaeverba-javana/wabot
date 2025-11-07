import {Router} from "express";
import {authenticate} from "./auth.js";

import {FlowNode} from "../db/mongoDb/models/index.js";

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

router.patch('/', async (req, res) => {
	function buildSetObject(updates, prefix = '') {
		const setObject = {};

		Object.keys(updates).forEach(key => {
			const fullPath = prefix ? `${prefix}.${key}` : key;
			const value = updates[key];

			if (value && typeof value === 'object' &&
					!Array.isArray(value) &&
					!(value instanceof Date)) {
				// Recursivamente convertir objetos anidados a notación de puntos
				Object.assign(setObject, buildSetObject(value, fullPath));
			} else {
				setObject[fullPath] = value;
			}
		});

		return setObject;
	}

	const r = await FlowNode.updateOne({_id: req.body._id}, {
		$set: buildSetObject({
			...req.body,
			_id: undefined
		})
	})
	res.send({message: r})
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
									FlowNode.updateOne({_id: node._id}, node)
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
