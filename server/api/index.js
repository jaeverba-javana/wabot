import {Router} from "express";

export default Router().use('/api',
		// (await import('./../db/mongoDb/models/userModel.js')).User.getEndpoints(),
		(await import('./../db/mongoDb/models/flowNode.model.js')).FlowNode.getEndpoints(),
		(await import('./authApi.js')).default,
		(await import('./chatbotApi.js')).default,
		(await import('./whatsappBusiness.js')).default,
		(await import('./fetchingApi.js')).default,
		(await import('./userApi.js')).default,
		(await import('./flowNode.api.js')).default,
		(req, res) => res.status(404).end()
)
