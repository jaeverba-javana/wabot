import { Router } from "express";
import authApi from './authApi.js';
import chatbotApi from './chatbotApi.js';

const router = Router()

router.use('/api', authApi)
router.use('/api', chatbotApi)

export default router
