import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/authController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.get('/login', loginUser)
router.post("/logout", authMiddleware, logoutUser)

export default router;
