import mongoose, { connection } from "mongoose";

const dbConnect = async () => {
  if (connection.readyState >= 1) {
    console.log("Server already connected or connecting");
    return;
  }

  const uri = process.env.MONGO_URI;
 

  if (!uri) {
    console.log("URI doesnt exist in ENV");
   process.exit(1)
  }

  try {
    await mongoose.connect(uri);
    console.log(`server COnnected to ${mongoose.connection.host}`);
  } catch (error: any) {
    console.log(`Connection Failed: ${error.message} `);
   process.exit(1)
  }
};

export default dbConnect;
