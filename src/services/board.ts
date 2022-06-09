import mongoose from "mongoose";
import BoardModel from "../models/board";
import BoardCategoryModel from "../models/boardCategory";
import HttpError from "../utils/httpError";

/**
 * Fetch a list containing all boards in the database
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
 * Fetch a board from the database based on its id
 *
 * @param {string} id - The id of the board to fetch
 *
 * @returns An object containing board information
 */
const getById = async (id: string) => {
  let board;

  try {
    board = await BoardModel.findById(id);
  } catch (err) {
    throw new HttpError("Error searching for board", 500);
  }
  if (!board) {
    throw new HttpError("Board not found", 404);
  }

  return board.toObject({ getters: true });
};

/**
 * Update a board's information
 *
 * @param {string} id - The id of the board to update
 * @param {string} topic - The new topic for the board
 * @param {string} description - The new description for the board
 * @param {string} categoryId - The id of the category to assign the board to
 *
 * @returns An object containing updated board information
 */
const update = async (
  id: string,
  topic: string,
  description: string,
  categoryId: string,
) => {
  let board;
  try {
    board = await BoardModel.findById(id);
  } catch (err) {
    throw new HttpError("Error fetching board", 500);
  }
  if (!board) {
    throw new HttpError("Board not found", 404);
  }

  try {
    board.topic = topic;
    board.description = description;

    const sess = await mongoose.startSession();
    sess.startTransaction();

    if (categoryId && categoryId !== board.category.id.toString()) {
      // Remove from original category
      const boardId = board.id;
      const oldCategory = await BoardCategoryModel.findById(board.category.id);
      const idx = oldCategory?.boards.findIndex(
        (boardObj) => boardObj.id === boardId,
      );

      oldCategory?.boards.splice(idx!, 1);
      await oldCategory?.save({ session: sess, validateModifiedOnly: true });

      // Add to new category
      const newCategory = await BoardCategoryModel.findById(categoryId);
      if (!newCategory) {
        throw new HttpError("Could not find category", 404);
      }

      newCategory.boards.push(board._id);
      await newCategory.save({ session: sess, validateModifiedOnly: true });

      board.category._id = newCategory._id;
      board.category.topic = newCategory.topic;
    }
    await board.save({ session: sess, validateModifiedOnly: true });

    await sess.commitTransaction();
  } catch (err) {
    throw new HttpError("Failed to update board.", 500);
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

/**
 * Delete a board from the database
 *
 * @param {string} id The id of the board to delete
 */
const del = async (id: string) => {
  let board;
  try {
    board = await BoardModel.findById(id);
  } catch (err) {
    throw new HttpError("Could not delete board", 500);
  }

  if (!board) {
    throw new HttpError("Could not find board", 404);
  }

  const boardObj = board.toObject({ getters: true });
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    // Remove the board from its category
    const boardId = board.id;
    const oldCategory = await BoardCategoryModel.findById(board.category.id);
    const idx = oldCategory?.boards.findIndex(
      (boardObj) => boardObj.id === boardId,
    );
    oldCategory?.boards.splice(idx!, 1);
    await oldCategory?.save({ session: sess, validateModifiedOnly: true });

    // Delete the board
    await BoardModel.findByIdAndDelete(boardId);
    await sess.commitTransaction();
  } catch (err) {
    throw new HttpError("Unable to delete board", 500);
  }

  return boardObj;
};

export default {
  getAll,
  getById,
  update,
  create,
  del,
};
