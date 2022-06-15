import express from "express";
import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import expressLoader from "../loaders/express";

import BoardCategoryService from "../services/boardCategory";
import BoardService from "../services/board";
import ThreadService from "../services/thread";
import PostService from "../services/post";
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
 * Generate a thread to be used for tests
 *
 * @returns An object containing thread information
 */
const generateThread = async () => {
  const username = "generatedThreadAuthor";
  const email = "generatedThreadAuthor@example.com";
  const password = "password123!";
  const user: any = await UserService.create(username, email, password);

  const boardCategoryTopic = "generatedCategory";
  const boardCategory: any = await BoardCategoryService.create(
    boardCategoryTopic,
    1,
  );

  const boardTopic = "generatedBoard";
  const boardDescription = "A generated board";
  const board: any = await BoardService.create(
    boardTopic,
    boardDescription,
    boardCategory.id,
  );

  const threadTopic = "A generated thread topic";
  const thread: any = await ThreadService.create(
    user.userId,
    board.id,
    threadTopic,
  );

  return thread;
};

/**
 * Generate a post to be used for tests
 *
 * @returns An object containing post information
 */
const generatePost = async () => {
  const username = "generatedPostAuthor";
  const email = "generatedPostAuthor@example.com";
  const password = "password123!";
  const user: any = await UserService.create(username, email, password);

  const boardCategoryTopic = "Post Testing Category";
  const boardCategory: any = await BoardCategoryService.create(
    boardCategoryTopic,
    1,
  );

  const boardTopic = "Post Testing Board";
  const boardDescription = "Generated board for post tests";
  const board: any = await BoardService.create(
    boardTopic,
    boardDescription,
    boardCategory.id,
  );

  const threadTopic = "Post Testing Thread";
  const thread: any = ThreadService.create(user.userId, board.id, threadTopic);

  const postContent = "Post Content";
  const post = PostService.create(user.userId, thread.id, postContent);

  return post;
};

/**
 * Generate a user to be used for tests
 *
 * @returns An object containing user information
 */
const generateUser = async () => {
  const username = "generatedUser";
  const email = "generatedUser@example.com";
  const password = "password123!";
  const user: any = UserService.create(username, email, password);

  return user;
};

/**
 * Create a test board category for use in tests
 *
 * @returns A BoardCategory object
 */
const generateBoardCategory = async () => {
  const category: any = await BoardCategoryService.create("TestCategory", 0);
  return category;
};

/**
 * Create a board for use in tests
 *
 * @returns A Board object
 */
const generateBoard = async () => {
  const category = await BoardCategoryService.create("TestCategory", 0);

  const board: any = await BoardService.create(
    "TestBoard",
    "TestBoard description",
    category.id,
  );

  return board;
};

export default {
  routeTestInit,
  controllerTestInit,
  serviceTestInit,
  generateThread,
  generatePost,
  generateUser,
  generateBoardCategory,
  generateBoard,
};
