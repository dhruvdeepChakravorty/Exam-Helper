import express from "express";
import errorHandler from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes"
const app = express();

app.use(cookieParser())
app.use(express.json())

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server Running" });
});

app.use("/api/auth",authRouter);






app.use(errorHandler)
export default app;
