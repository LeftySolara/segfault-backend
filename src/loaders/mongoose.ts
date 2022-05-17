import mongoose from "mongoose";

import config from "../config/";
import loggerService from "../services/logger";

// To be called when process is restarted or terminated
const gracefulShutdown = (msg: String): void => {
  mongoose.connection.close(() => {
    loggerService.info("Mongoose disconnected through " + msg);
  });
};

export default async (): Promise<void> => {
  try {
    mongoose.connection.on("connected", () => {
      loggerService.info(`Connected to ${process.env.NODE_ENV} database.`);
    });
    mongoose.connection.on("error", (err) => {
      loggerService.error("Mongoose connection error " + err);
    });
    mongoose.connection.on("disconnected", () => {
      loggerService.info("Mongoose disconnected");
    });

    // For nodemon restarts
    process.once("SIGUSR2", () => {
      gracefulShutdown("nodemon restart");
    });

    // For app termination
    process.on("SIGINT", () => {
      gracefulShutdown("app termination");
    });

    await mongoose.connect(config.db.connection_string || "");
  } catch (err: unknown) {
    if (err instanceof Error) {
      loggerService.error(err.message);
    }
  }
};
