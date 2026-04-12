
import 'dotenv/config'
import { setServers } from "dns"
setServers(["8.8.8.8", "8.8.4.4"])


import app from "./app";
import dbConnect from "./config/dbConnect";
import { env } from "./config/env";


const startServer = async () => {
  await dbConnect();
  const port = env.PORT || 3000;

  app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}`);
  });
};

startServer();
