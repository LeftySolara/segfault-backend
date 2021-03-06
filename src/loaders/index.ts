import expressLoader from "./express";
import mongooseLoader from "./mongoose";
import loggerService from "../services/logger";
import { Application } from "express";

export default async (expressApp: Application) => {
  loggerService.info("Starting application...");

  await expressLoader({ app: expressApp });
  loggerService.info("Express initialized.");
  await mongooseLoader();
};
