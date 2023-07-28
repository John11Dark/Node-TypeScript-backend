import mongoose from "mongoose";
import config from "config";
// ? * -->
import logger from "./logger.utils";
export default async function connect() {
  const db = config.get<string>("dbURL");
  const dbConfig = {
    useNewUrlParser: true,
    autoIndex: true,
    useUnifiedTopology: true,
  };

  try {
    await mongoose.connect(db, dbConfig);
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
