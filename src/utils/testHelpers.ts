import express from "express";
import mongoose from "mongoose";
import request from "supertest";
import initLoaders from "../loaders";
import mongooseLoader from "../loaders/mongoose";

import BoardCategoryService from "../services/boardCategory";

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

/**
 * Create a new board category and returns its database id
 *
 * @param topic The name of the category to create
 */
const generateCategoryId = async (topic: string) => {
  const categoryObj: any = await BoardCategoryService.create(topic, 1);
  const id = categoryObj._id;

  return id;
};

export default { routeTestInit, controllerTestInit, generateCategoryId };
