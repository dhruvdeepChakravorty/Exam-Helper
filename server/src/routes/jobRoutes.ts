import { Router } from "express"
import { getJobHistory, getJobStatus } from "../controllers/jobController"
import authMiddleware from "../middlewares/authMiddleware"

const router = Router()

router.get("/:jobId/status", authMiddleware, getJobStatus)
router.get('/history',authMiddleware,getJobHistory)


export default router