import mongoose from "mongoose";
import BoardModel from "../models/board";
import BoardCategoryModel from "../models/boardCategory";
import HttpError from "../utils/httpError";

/**
 * Get all boards from the database
 *
 * @returns An array of board objects
 */
const getAll = async () => {
  let boards;

  try {
    boards = await BoardModel.find({});
  } catch (err) {
    throw new HttpError("Failed to fetch boards", 500);
  }

  return boards.map((board) => board.toObject({ getters: true }));
};

/**
 * Get a board from the database by its id
 *
 * @param id The id of the board to fetch
 *
 * @returns An object containing board information
 */
const getById = async (id: string) => {
  let board;

  try {
    board = await BoardModel.findById(id);
  } catch (err) {
    console.log(err);
    throw new HttpError("Error searching for board", 500);
  }

  if (!board) {
    throw new HttpError("Board not found", 404);
  }

  return board.toObject({ getters: true });
};

/**
 * Create a new board
 *
 * @param topic The name of the new board
 * @param description A brief description of the board's topic
 * @param categoryId The id of the category the board belongs to
 *
 * @returns An object containing board information
 */
const create = async (
  topic: string,
  description: string,
  categoryId: string,
) => {
  // Verify the category we're assigning to the board actually exists
  let category;
  try {
    category = await BoardCategoryModel.findById(categoryId);
  } catch (err: unknown) {
    throw new HttpError("Creating board failed.", 500);
  }
  if (!category) {
    throw new HttpError("Creating board failed. Could not find category.", 422);
  }

  // Check whether the board already exists
  let existingBoard;
  try {
    existingBoard = await BoardModel.findOne({ topic });
  } catch (err: unknown) {
    throw new HttpError("Creating board failed.", 500);
  }

  if (existingBoard) {
    throw new HttpError("Creating board failed. Board exists.", 422);
  }

  // Create the new board
  const board = new BoardModel({
    topic,
    description,
    category: {
      id: categoryId,
      topic: category.topic,
    },
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await board.save({ session: sess });
    const boardId = (board.toObject({ getters: true }) as any).id;

    category.boards.push(boardId);
    await category.save({ session: sess, validateModifiedOnly: true });

    await sess.commitTransaction();
  } catch (err: unknown) {
    throw new HttpError("Failed to create board.", 500);
  }

  return board.toObject({ getters: true });
};

export default {
  getAll,
  getById,
  create,
};
