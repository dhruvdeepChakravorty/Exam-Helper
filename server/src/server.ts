import { setServers } from "dns"
setServers(["8.8.8.8", "8.8.4.4"])


import app from "./app";
import dotenv from "dotenv";
import dbConnect from "./config/dbConnect";

dotenv.config();
const startServer = async () => {
  await dbConnect();
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}`);
  });
};

startServer();
