import {Router} from "express";
import {sharedCache} from "../utils/cache.js";
import {writeFile} from "node:fs";
import {
	ChatbotModel,
	ConversationModel,
	MessageModule
} from "../db/mongoDb/models/index.js";
import FlowEngine from "../controller/FlowEngine.js";
import {wabaApi} from "../utils/axios.js";

const router = Router({strict: true})

const requireAuth = (req, res, next) => {
	// console.log(req)
	const {hub} = req.queries

	if (!hub.verify_token || hub.verify_token !== process.env.WHATSAPP_WEBHOOK_TOKEN)
		return res.status(403).end()

	// res.status(200).send(hub.challenge)
	next()
}

const reStructQuery = (req, res, next) => {
	// if (!req.query || !req.query.length) return next()
	console.log(req.query)
	if (!req.query || Object.keys(req.query).length === 0) return next()

	req.queries = {}

	for (const [fullKey, value] of Object.entries(req.query)) {
		const keys = fullKey.split('.')
		let current = req.queries

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i]

			if (i === keys.length - 1) {
				current[key] = value
			} else {
				if (!current[key] || typeof current[key] !== 'object') {
					current[key] = {}
				}

				current = current[key]
			}
		}

	}

	next()
}

router.get('/webhook', reStructQuery, (req, res) => {
	console.log(req.queries)
	console.log(req.body)

	res.send(req.queries.hub.challenge)
})

// 15 minutes TTL for deduplication of incoming messages
const FIFTEEN_MIN_MS = 15 * 60 * 1000;

router.post('/webhook', async (req, res) => {
	// await writeFile(new URL('./webhook.json', import.meta.url), JSON.stringify({body: req.body, headers: req.headers}, null, 2), (err) => {
	// 	console.info(err)
	// })

	console.log('body')
	console.log(JSON.stringify(req.body, null, 2))

	if (req.body && req.body.object === 'whatsapp_business_account') {
		try {
			const change = req.body?.entry?.[0].changes?.[0];

			if (change && change.field === 'messages') {
				const value = change?.value;

				if (value && value.messaging_product === 'whatsapp') {
					const {metadata} = value;

					if (value.messages) {
						const {messages} = value;
						const chatbot = await ChatbotModel.findByPhoneId(metadata['phone_number_id']);
						if (!chatbot) return res.status(403).end();

						const conversation = await ConversationModel.findByPhoneNumberId(chatbot, messages[0]['from']);
						if (!conversation) return res.status(403).end();

						const incomingMessage = await MessageModule.create({
							conversationId: conversation._id,
							direction: 'inbound',
							from: messages[0]['from'],
							to: metadata['display_phone_number'],
							type: 'text',// messages[0]['type'],
							content: {
								//messages[0][messages[0]['type']]
								body: messages[0]['text']?.['body']??
										messages[0]['interactive']?.['button_reply']?.['title']
							},
						});

						const flowResult = await FlowEngine.processIncomingMessage(
								conversation, incomingMessage.content.body
						);


						console.log('flowResult', flowResult)

						if (flowResult.shouldSend) {
							const {data: smData} = await wabaApi(
									chatbot.phoneId,
									chatbot.token
							).post('/messages', {
								...flowResult.message,
								to: conversation.userPhone,
								recipient_type: 'individual',
								messaging_product: 'whatsapp'
							}).catch(e => console.error('Error sending message:', e.response?.data || e.response?.status || e.message || e))

							const message = await MessageModule.create({
								conversationId: conversation._id,
								direction: 'outbound',
								from: incomingMessage.to,
								to: incomingMessage.from,
								type: flowResult.message.type,
								content: flowResult.message?.text?? {
									body: flowResult.message?.interactive?.body.text
								}
							})

							conversation.lastMessageAt = new Date();
							conversation.lastMessagePreview =
									message.content.body.substring(0, 200) || '';
							conversation.flowState.lastBotMessageAt = conversation.lastMessageAt;
							await conversation.save();
						}
					}
				}
			}
			res.send("ok");
		} catch (e) {
			console.error("Error processing webhook:", e);
			return res.status(200).send("ok"); // Always 200 to avoid retries flooding
		}
	}


})

export default Router().use('/wab', router)