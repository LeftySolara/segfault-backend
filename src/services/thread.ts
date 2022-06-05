import mongoose from "mongoose";

import ThreadModel from "../models/thread";
import BoardModel from "../models/board";
import UserModel from "../models/user";

import HttpError from "../utils/httpError";

/**
 * Get a list of all threads
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

export default { getAll, create };
