import express from "express";
import mongoose from "mongoose";
import initLoaders from "../loaders";
import mongooseLoader from "../loaders/mongoose";
import logger from "../services/logger";

const routeTestInit = (app: express.Application) => {
  beforeAll(async () => {
    await initLoaders(app);
    await mongoose.connection.dropDatabase();
  });

  afterAll(async () => {
    logger.info("Closing database connection...");
    await mongoose.connection.close();
    logger.info("Database connection closed.");
  });
};

const controllerTestInit = () => {
  beforeAll(async () => {
    await mongooseLoader();
    await mongoose.connection.dropDatabase();
  });

  afterAll(async () => {
    logger.info("Closing database connection...");
    await mongoose.connection.close();
    logger.info("Database connection closed.");
  });
};

export default { routeTestInit, controllerTestInit };
