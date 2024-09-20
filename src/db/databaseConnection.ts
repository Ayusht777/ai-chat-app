import { connect, disconnect } from "mongoose";
import { DB_NAME } from "../constant.js";
const ConnectToDB = async () => {
  const { DB_USER_NAME, DB_USER_PASSWORD } = process.env;

  if (!DB_USER_NAME || !DB_USER_PASSWORD) {
    throw new Error(
      "Database credentials are missing from environment variables."
    );
  }
  try {
    const connectionInstance = await connect(
      `mongodb+srv://${DB_USER_NAME}:${DB_USER_PASSWORD}@cluster0.w8eqc.mongodb.net/${DB_NAME}`
    );
   
    console.log(
      `mongodb database is connected -> ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`error while connecting to database -> ${error}`);
    throw error;
  }
};
const DisconnectDB = async () => {
  try {
    await disconnect();
    console.log("Database disconnected");
  } catch (error) {
    console.log(`error while disconnecting to database -> ${error}`);
    throw error;
  }
};

export { ConnectToDB, DisconnectDB };
