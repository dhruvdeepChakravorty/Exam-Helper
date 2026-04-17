import express from "express";
import errorHandler from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes";
import helmet from "helmet";
import morgan from "morgan";
import { globalLimiter } from "./middlewares/globalLimiter";
import uploadRouter from "./routes/uploadRoutes";
import jobRouter from './routes/jobRoutes'

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(globalLimiter);
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server Running" });
});

app.use("/api/auth", authRouter);
app.use("/api/uploads", uploadRouter);
app.use("/api/jobs", jobRouter)

app.use(errorHandler);
export default app;
