import HttpError from "../utils/httpError";
import BoardCategoryModel from "../models/boardCategory";

/**
 * Fetch a board category by its ID
 *
 * @param id The ID of the category
 *
 * @returns An object containing the category information
 */
const getById = async (id: string) => {
  let boardCategory;

  try {
    boardCategory = await BoardCategoryModel.findById(id);
  } catch (err) {
    throw new HttpError(`Could not find category with id ${id}.`, 404);
  }

  return boardCategory?.toObject({ getters: true });
};

/**
 * Update a board category's information
 *
 * @param id The id of the board to update
 * @param topic The new category topic
 * @param sortOrder The new category sort order
 *
 * @returns An object containing the new category information
 */
const update = async (id: string, topic: string, sortOrder: number) => {
  let boardCategory;

  try {
    boardCategory = await BoardCategoryModel.findById(id);
  } catch (err) {
    throw new HttpError("Board category not found", 404);
  }

  boardCategory!.topic = topic;
  boardCategory!.sortOrder = sortOrder;

  try {
    await boardCategory?.save();
  } catch (err) {
    throw new HttpError("Could not update category", 500);
  }

  return boardCategory?.toObject({ getters: true });
};

/**
 * Add a new board category to the database
 *
 * @param topic The name of the category
 * @param sortOrder The order in which to sort among other categories
 */
const create = async (topic: string, sortOrder: number) => {
  let existingBoardCategory;
  try {
    existingBoardCategory = await BoardCategoryModel.findOne({ topic });
  } catch (err) {
    throw new HttpError("Category creation failed", 500);
  }

  if (existingBoardCategory) {
    throw new HttpError("Category exists", 422);
  }

  const newBoardCategory = new BoardCategoryModel({
    topic,
    boards: [],
    sortOrder,
  });

  try {
    await newBoardCategory.save();
  } catch (err) {
    throw new HttpError("Failed to create category", 500);
  }
};

export default {
  getById,
  update,
  create,
};
