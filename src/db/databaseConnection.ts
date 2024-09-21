import { connect, disconnect } from "mongoose";
import { DB_NAME } from "../constant.js";
const ConnectToDB = async () => {
  try {
    const connectionInstance = await connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
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
