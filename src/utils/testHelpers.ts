import express from "express";
import mongoose from "mongoose";
import initLoaders from "../loaders";
import mongooseLoader from "../loaders/mongoose";

const routeTestInit = (app: express.Application) => {
  beforeAll(async () => {
    await initLoaders(app);
    await mongoose.connection.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
};

const controllerTestInit = () => {
  beforeAll(async () => {
    await mongooseLoader();
    await mongoose.connection.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
};

export default { routeTestInit, controllerTestInit };
