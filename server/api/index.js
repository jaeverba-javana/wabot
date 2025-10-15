import { Router } from "express";
import authApi from './authApi.js';
import chatbotApi from './chatbotApi.js';
import userApi from "./userApi.js";

const router = Router()

router.use('/api', authApi)
router.use('/api', chatbotApi)
router.use("/api/user", userApi)

export default router
