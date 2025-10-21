import { Router } from "express";
import { isAuthenticated } from '../api/auth.js';
import { Chatbot } from './../db/mongoDb/models/index.js';
import { chatBotController } from './../controller/index.js';
import {wabaApi} from "../utils/axios.js";

const router = Router({
    strict: true
});

const requireAuth = async (req, res, next) => {
    const user = await isAuthenticated(req);
    if (!user) {
        return res.status(401).json({ message: "No autorizado" , from:'chatbotApi'});
    }
    req.user = user;
    next();
}

router.patch('/', async (req, res) => {
	const chatbot = await chatBotController.get(req.user._id)
	console.log(chatbot)
	chatbot.phoneId = req.body.phoneId
	chatbot.token = req.body.token

	await chatBotController.update(chatbot)

	const {data: wabaResponse} = await wabaApi(
			chatbot.phoneId,
			chatbot.token
	).get("")

	req.user.phone = wabaResponse.display_phone_number
	const user = await req.user.save()

	// console.log(wabaResponse)
	// console.log(user)
	// console.log(req.user)

	res.send({message: "Phone ID updated successfully", data: {chatbot, user}})
})

// Get chatbot configuration for the current user
router.get('/', async (req, res) => {
    try {
        const chatbot = await Chatbot.findOne({ userId: req.user.userId });
        if (!chatbot) {
            return res.status(404).json({ message: "No se encontró configuración de chatbot" });
        }
        res.json(chatbot);
    } catch (error) {
        console.error("Error al obtener configuración de chatbot:", error);
        res.status(500).json({ message: "Error al obtener configuración de chatbot" });
    }
});

// Create or update chatbot configuration
router.post('/', async (req, res) => {
    try {
        const { business, chatbot, predefinedResponses } = req.body;

        // Validate required fields
        if (!business || !business.name || !business.phone || !chatbot || !chatbot.welcomeMessage) {
            return res.status(400).json({ message: "Faltan campos requeridos" });
        }

        // Find existing chatbot or create new one
        let chatbotConfig = await Chatbot.findOne({ userId: req.user.userId });

        if (chatbotConfig) {
            // Update existing chatbot
            chatbotConfig.business = business;
            chatbotConfig.chatbot = chatbot;
            chatbotConfig.predefinedResponses = predefinedResponses;
            await chatbotConfig.save();
        } else {
            // Create new chatbot
            chatbotConfig = new Chatbot({
                userId: req.user.userId,
                business,
                chatbot,
                predefinedResponses
            });
            await chatbotConfig.save();
        }

        res.status(200).json(chatbotConfig);
    } catch (error) {
        console.error("Error al guardar configuración de chatbot:", error);
        res.status(500).json({ message: "Error al guardar configuración de chatbot" });
    }
});

// Delete chatbot configuration
router.delete('/', async (req, res) => {
    try {
        const result = await Chatbot.deleteOne({ userId: req.user.userId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No se encontró configuración de chatbot" });
        }
        res.status(200).json({ message: "Configuración de chatbot eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar configuración de chatbot:", error);
        res.status(500).json({ message: "Error al eliminar configuración de chatbot" });
    }
});

export default Router().use('/chatbot', requireAuth, router);
