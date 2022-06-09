import HttpError from "../utils/httpError";
import BoardCategoryModel from "../models/boardCategory";

/**
 * Fetch a list of all board categories
 *
 * @throws after a database error
 *
 * @returns An array of boardCategory objects
 */
const getAll = async () => {
  let boardCategories;

  try {
    boardCategories = await BoardCategoryModel.find({});
  } catch (err) {
    throw new HttpError("Fetching board categories failed", 500);
  }

  return boardCategories.map((category) =>
    category.toObject({ getters: true }),
  );
};

/**
 * Fetch a board category based on its Id
 *
 * @param {string} id - The id of the category to fetch
 *
 * @throws after a database error
 * @throws if the category cannot be found
 *
 * @returns An object containing category information
 */
const getById = async (id: string) => {
  let boardCategory;

  try {
    boardCategory = await BoardCategoryModel.findById(id);
  } catch (err) {
    throw new HttpError(`Error fetching category`, 500);
  }
  if (!boardCategory) {
    throw new HttpError(`Could not find category with id ${id}.`, 404);
  }

  return boardCategory.toObject({ getters: true });
};

/**
 * Update a board category's information
 *
 * @param {string} id - The id of the board to update
 * @param {string} topic - The new category topic
 * @param {string} sortOrder - The new category sort order
 *
 * @throws after a database error
 * @throws if the category cannot be found
 *
 * @returns An object containing updated category information
 */
const update = async (id: string, topic: string, sortOrder: number) => {
  let boardCategory;

  try {
    boardCategory = await BoardCategoryModel.findById(id);
  } catch (err) {
    throw new HttpError("Error fetching board category", 500);
  }
  if (!boardCategory) {
    throw new HttpError(`Could not find category with id ${id}`, 404);
  }

  boardCategory.topic = topic;
  boardCategory.sortOrder = sortOrder;

  try {
    await boardCategory.save();
  } catch (err) {
    throw new HttpError("Could not update category", 500);
  }

  return boardCategory.toObject({ getters: true });
};

/**
 * Create a new board category and add it to the database
 *
 * @param {string} topic - The name of the category
 * @param {string} sortOrder - The order in which to sort among other categories
 *
 * @throws after a database error
 * @throws if the category already exists
 *
 * @returns An object containing information from the new category
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

  return newBoardCategory.toObject({ getters: true });
};

/**
 * Delete a board category from the database
 *
 * @param {string} id - The id of the board to delete
 *
 * @throws after a database error
 * @throws if the category cannot be found
 *
 * @returns An object containing information from the category that was deleted
 */
const del = async (id: string) => {
  let category;
  try {
    category = await BoardCategoryModel.findById(id);
  } catch (err) {
    throw new HttpError("Could not delete category", 500);
  }
  if (!category) {
    throw new HttpError(`Could not find a board category for id ${id}`, 404);
  }

  let categoryObj;
  try {
    categoryObj = category.toObject({ getters: true });
    await BoardCategoryModel.findByIdAndDelete(id);
  } catch (err) {
    throw new HttpError("Unable to delete board category", 500);
  }

  return categoryObj;
};

export default {
  getAll,
  getById,
  update,
  create,
  del,
};
