import { Router } from "express"
import { getJobStatus } from "../controllers/jobController"
import authMiddleware from "../middlewares/authMiddleware"

const router = Router()

router.get("/:jobId/status", authMiddleware, getJobStatus)

export default router