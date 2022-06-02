import express from "express";
import mongoose from "mongoose";
import initLoaders from "../loaders";
import mongooseLoader from "../loaders/mongoose";

import BoardCategoryService from "../services/boardCategory";
import BoardService from "../services/board";
import UserService from "../services/user";

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

const serviceTestInit = () => {
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
  const id = categoryObj.id;

  return id;
};

/**
 * Create a new board and return its id
 *
 * @param topic The name of the board
 * @param description A brief description of the board
 * @param categoryId The category the board belongs to
 *
 * @returns The id of the newly-created board
 */
const generateBoardId = async (
  topic: string,
  description: string,
  categoryId: string,
) => {
  const boardObj: any = await BoardService.create(
    topic,
    description,
    categoryId,
  );
  const id = boardObj.id;

  return id;
};

/**
 * Create a new user and return its id
 *
 * @param {string} username The user's username
 * @param {string} email The user's email address
 * @param {string} password The user's password
 *
 * @returns
 */
const generateUserId = async (
  username: string,
  email: string,
  password: string,
) => {
  const userObj: any = await UserService.create(username, email, password);
  return userObj.userId;
};

export default {
  routeTestInit,
  controllerTestInit,
  serviceTestInit,
  generateCategoryId,
  generateBoardId,
  generateUserId,
};
