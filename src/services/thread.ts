import mongoose from "mongoose";

import ThreadModel from "../models/thread";
import BoardModel from "../models/board";
import UserModel from "../models/user";

import HttpError from "../utils/httpError";

/**
 * Fetch a list of all threads
 *
 * @throws after a database error
 *
 * @returns An array of thread objects
 */
const getAll = async () => {
  let threads;

  try {
    threads = await ThreadModel.find({});
  } catch (err: unknown) {
    throw new HttpError("Error fetching threads", 500);
  }

  return threads.map((thread) => thread.toObject({ getters: true }));
};

/**
 * Fetch a thread by its id
 *
 * @param {string} id - The id of the thread to fetch
 *
 * @throws after a database error
 * @throws if the thread cannot be found
 *
 * @returns An object containing thread information
 */
const getById = async (id: string) => {
  let thread;

  try {
    thread = await ThreadModel.findById(id);
  } catch (err: unknown) {
    throw new HttpError("Unable to fetch thread", 500);
  }

  if (!thread) {
    throw new HttpError(`Cannot find thread with id ${id}`, 404);
  }

  return thread.toObject({ getters: true });
};

/**
 * Fetch all of a user's threads
 *
 * @param {string} id - The id of the user
 *
 * @throws after a database error
 * @throws if the user cannot be found
 *
 * @returns An array of thread objects
 */
const getByUser = async (id: string) => {
  // Verify the user exists
  let user;
  try {
    user = await UserModel.findById(id);
  } catch (err: unknown) {
    throw new HttpError("Error fetching threads from user", 500);
  }
  if (!user) {
    throw new HttpError("Could not find user", 404);
  }

  // Find the threads
  let threads;
  try {
    threads = await ThreadModel.find({ "author.authorId": id });
  } catch (err: unknown) {
    throw new HttpError("Error fetching threads from user", 500);
  }

  return threads.map((thread) => thread.toObject({ getters: true }));
};

/**
 * Update a thread's information
 *
 * @param {string} id - The id of the thread to update
 * @param {string} topic - The new topic to assign to the thread
 *
 * @throws after a database error
 * @throws if the thread is not found
 *
 * @returns A thread object with updated information
 */
const update = async (id: string, topic: string) => {
  let thread;
  try {
    thread = await ThreadModel.findById(id);
  } catch (err: unknown) {
    throw new HttpError("Unable to fetch thread", 500);
  }
  if (!thread) {
    throw new HttpError("Thread not found", 404);
  }

  try {
    thread.topic = topic;
    await thread.save();
  } catch (err: unknown) {
    throw new HttpError("Unable to update thread", 500);
  }

  return thread.toObject({ getters: true });
};

/**
 * Create a new thread and add it to the database
 *
 * @param {string} authorId - The id of the user creating the thread
 * @param {string} boardId - The id of the board that the thread will belong to
 * @param {string} topic - A brief description of the thread's subject matter
 *
 * @throws after a database error
 * @throws if the board does not exist
 * @throws if the author does not exist
 *
 * @returns An object containing information about the newly-created thread
 */
const create = async (authorId: string, boardId: string, topic: string) => {
  // Find the board that the thread will be assigned to
  let board;
  try {
    board = await BoardModel.findById(boardId);
  } catch (err: unknown) {
    throw new HttpError("Error creating thread", 500);
  }
  if (!board) {
    throw new HttpError("Cannot find board to create thread", 404);
  }

  // Find the user who's creating the thread
  let author;
  try {
    author = await UserModel.findById(authorId);
  } catch (err: unknown) {
    throw new HttpError("Error creating thread", 500);
  }
  if (!author) {
    throw new HttpError("Cannot find user", 404);
  }

  // Create the thread
  const thread = new ThreadModel({
    author: {
      authorId: author.id,
      username: author.username,
      email: author.email,
    },
    board: {
      boardId: board.id,
      topic: board.topic,
    },
    topic,
    dateCreated: Date.now(),
    posts: [],
    lastPost: null,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await thread.save({ session: sess });

    board.threads.push(thread.id);
    await board.save({ session: sess, validateModifiedOnly: true });

    author.threads.push(thread.id);
    await author.save({ session: sess, validateModifiedOnly: true });

    sess.commitTransaction();
  } catch (err: unknown) {
    throw new HttpError("Unable to create thread", 500);
  }

  return thread.toObject({ getters: true });
};

export default { getAll, getById, getByUser, update, create };
