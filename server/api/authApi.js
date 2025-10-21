import argon from "argon2";
import {Router} from "express";

import {tokenGenerate} from "./../utils/token.js"
import {Chatbot, User} from './../db/mongoDb/models/index.js'

const router = Router({
	strict: true
})

router.post('/login', async (req, res, next) => {
	User.findOne({email: req.body.email}).exec().then((user) => {
		if (!user) {
			res.status(404).end();
			return;
		}

		argon.verify(user.password, req.body.password ?? "").then((isCorrectPass) => {
			if (isCorrectPass) {
				const expireDate = new Date()
				expireDate.setDate(expireDate.getDate() + 30);
				res.cookie("SESSION_TOKEN", tokenGenerate({userId: user._id}, {expiresIn: '30d'}), {
					expires: expireDate,
				},);
				res.status(200).end();
			} else {
				res.status(403).end();
			}
		}).catch((r) => {
			console.log(r);

			res.status(500).send(r)
		});
	}).catch((r) => {
		res.status(400).send(r)
	});
})

router.post('/register', async (req, res, next) => {
	const {data} = req.body

	new User({
		email: data.email, password: await argon.hash(data.password),
	})
			.save()
			.then((user) => {
				const expireDate = new Date()
				expireDate.setDate(expireDate.getDate() + 30);
				res.cookie(
						'SESSION_TOKEN',
						tokenGenerate(
								{userId: user._id},
								{expiresIn: '30d'}
						),
						{
							expires: expireDate
						}
				)

				new Chatbot({
					userId: user._id
				})
						.save()
						.then(() => {
							res.send(user)
						})
			})
			.catch((reason) => {
				console.log(reason);

				if (reason instanceof ReferenceError) res.status(500).send(reason);
				else res.status(500).send({
					message: "error when saving user", reason: {
						code: reason.errorResponse?.code,
						labels: Object.getOwnPropertyNames(reason.errorResponse?.keyPattern),
						values: reason.errorResponse?.keyValue
					}
				});
			});
})

export default Router().use('/auth', router)