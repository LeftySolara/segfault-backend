import { Request, Response } from "express";
import validateRequestInputs from "../../utils/inputValidator";
import loggerService from "../../services/logger";
import HttpError from "../../utils/httpError";
import BoardCategoryService from "../../services/boardCategory";

/**
 * Fetch all board categories
 *
 * @returns On success, returns status code 200 and an array of boardCategory objects
 */
const getCategories = async (req: Request, res: Response, next: Function) => {
  let boardCategories;

  try {
    boardCategories = await BoardCategoryService.getAll();
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(200).json({ categories: boardCategories });
};

/**
 * Fetch a board category by its ID
 *
 * @returns On success, returns a boardCategory object. On failure, returns 404 and an error message.
 */
const getCategoryById = async (req: Request, res: Response, next: Function) => {
  const { id } = req.params;
  let boardCategory;

  try {
    boardCategory = await BoardCategoryService.getById(id);
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(200).json({ boardCategory });
};

/**
 * Update a board category's information
 *
 * @returns On success, returns status code 200 and an object containing the new category information
 */
const updateCategory = async (req: Request, res: Response, next: Function) => {
  const validationError = validateRequestInputs(req);
  if (validationError) {
    return next(validationError);
  }

  const { topic, sortOrder } = req.body;
  const { id } = req.params;
  let boardCategory;

  try {
    boardCategory = await BoardCategoryService.update(id, topic, sortOrder);
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(200).json({ category: boardCategory });
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
