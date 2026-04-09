import express from "express";
import errorHandler from "./middlewares/errorHandler";

const app = express();

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server Running" });
});







app.use(errorHandler)
export default app;
