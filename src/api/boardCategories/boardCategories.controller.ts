import { Request, Response } from "express";
import validateRequestInputs from "../../utils/inputValidator";
import loggerService from "../../services/logger";
import HttpError from "../../utils/httpError";
import BoardCategoryService from "../../services/boardCategory";
import boardCategory from "../../models/boardCategory";

/**
 * Fetch all board categories
 *
 * @returns Status code 200 and a confirmation message
 */
const getCategories = async (req: Request, res: Response, next: Function) => {
  let boardCategories;

  try {
    boardCategories = await boardCategory.find({});
  } catch (err) {
    loggerService.error("Failed to fetch board categories");
    const error = new HttpError("Fetching board categories failed", 500);
    return next(error);
  }

  return res
    .status(200)
    .json({
      boardCategories: boardCategories.map((category) =>
        category.toObject({ getters: true }),
      ),
    });
};

/**
 * Fetch a board category by its ID
 *
 * @returns Status code 200 and a confirmation message
 */
const getCategoryById = (req: Request, res: Response, next: Function) => {
  return res.status(200).json({ message: "Fetching board category..." });
};

/**
 * Update a board category's info
 *
 * @returns Status code 200 and a confirmation message
 */
const updateCategory = (req: Request, res: Response, next: Function) => {
  return res.status(200).json({ message: "Updating category..." });
};

/**
 * Create a new board category
 *
 * @returns On success, returns status code 201 and a confirmation message
 */
const createCategory = async (req: Request, res: Response, next: Function) => {
  const validationError = validateRequestInputs(req);
  if (validationError) {
    return next(validationError);
  }

  const { topic, sortOrder } = req.body;

  try {
    await BoardCategoryService.create(topic, sortOrder);
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  loggerService.info(`Created new board category ${topic}.`);
  return res.status(201).json({ message: `Created new category ${topic}.` });
};

const deleteCategory = (req: Request, res: Response, next: Function) => {
  return res.status(200).json({ message: "Deleting board category..." });
};

export default {
  getCategories,
  getCategoryById,
  updateCategory,
  createCategory,
  deleteCategory,
};
