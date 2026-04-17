import express from "express"
import authMiddleware from "../middlewares/authMiddleware"
import { fileUploadUrl, uploadConfirm } from "../controllers/uploadController"
import { uploadLimiter } from "../middlewares/globalLimiter"

const router = express.Router()


router.post('/presigned-url', authMiddleware,fileUploadUrl)
router.post('/confirm',authMiddleware,uploadConfirm)

export default router