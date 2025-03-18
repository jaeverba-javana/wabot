import { Router } from "express";
import authApi from './authApi.js';

const router = Router()

router.use('/api', authApi)

export default router