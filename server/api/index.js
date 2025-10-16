import { Router } from "express";
import authApi from './authApi.js';
import chatbotApi from './chatbotApi.js';
import userApi from "./userApi.js";
import whatsappBusiness from "./whatsappBusiness.js";

const router = Router()

router.use('/api', authApi)
router.use('/api', chatbotApi)
router.use('/api', whatsappBusiness)
router.use("/api/user", userApi)

export default router
