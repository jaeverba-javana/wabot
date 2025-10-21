import {Chatbot} from "../db/mongoDb/models/index.js";

/**
 *
 * @param {string} userId
 */
export const get = (userId) =>
		new Promise((resolve, reject) => {
			Chatbot.findOne({
				userId: userId
			}).exec().then((chatbot) => {
				resolve(chatbot || create(userId))
			}).catch((e) => {
				reject(e)
			})
		});

export const create = (userId) =>
		new Promise((resolve, reject) => {
			new Chatbot({
				userId: userId
			}).save().then((chatbot) => {
				resolve(chatbot)
			}).catch((e) => {
				reject(e)
			})
		})

export const update = (chatbot) =>
		new Promise((resolve, reject) => {
			chatbot.save().then((chatbot) => {
				resolve(chatbot)
			}).catch((e) => {
				reject(e)
			})
		})