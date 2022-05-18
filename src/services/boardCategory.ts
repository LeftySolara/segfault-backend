import HttpError from "../utils/httpError";
import BoardCategoryModel from "../models/boardCategory";

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
  create,
};
