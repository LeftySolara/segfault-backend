import express from "express";
import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import expressLoader from "../loaders/express";

import BoardCategoryService from "../services/boardCategory";
import BoardService from "../services/board";
import ThreadService from "../services/thread";
import UserService from "../services/user";

let replset: MongoMemoryReplSet;

// Connect to the database
const connect = async () => {
  replset = await MongoMemoryReplSet.create();
  const uri = replset.getUri();
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions;

  await mongoose.connect(uri, mongooseOpts);
};

// Disconnect from the database
const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await replset.stop();
};

// Remove all data from the database
const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

const routeTestInit = (app: express.Application) => {
  beforeAll(async () => {
    await expressLoader({ app });
    await connect();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });
};

const controllerTestInit = () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });
};

const serviceTestInit = () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
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
 * Create a new thread and return its id
 *
 * @param {string} authorId - The id of the thread's author
 * @param {string} boardId - The id of the board that the thread belongs to
 * @param {string} topic - The topic of the thread
 *
 * @returns The id of the created thread
 */
const generateThreadId = async (
  authorId: string,
  boardId: string,
  topic: string,
) => {
  const threadObj: any = await ThreadService.create(authorId, boardId, topic);

  return threadObj.id;
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
  generateThreadId,
  generateUserId,
};
