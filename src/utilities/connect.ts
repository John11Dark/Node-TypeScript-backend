import mongoose from "mongoose";
import config from "config";
// ? * -->
import logger from "./logger";
export default async function connect() {
  const db = config.get<string>("dbURL");

  try {
    await mongoose.connect(db);
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV == undefined
    )
      logger.info(`Connected to database ${db}...`);
  } catch (error) {
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV == undefined
    )
      logger.error(error);
    process.exit(1);
  }
}
