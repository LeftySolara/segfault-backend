import mongoose from "mongoose";

import config from "../config/";
import loggerService from "../services/logger";

export default async (): Promise<void> => {
  try {
    await mongoose.connect(config.db.connection_string || "");
    loggerService.info(`Connected to ${process.env.NODE_ENV} database.`);
  } catch (err: unknown) {
    if (err instanceof Error) {
      loggerService.error(err.message);
    }
  }
};
