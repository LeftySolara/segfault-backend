import { Request, Response } from "express";

/**
 * Fetch all board categories
 *
 * @returns Status code 200 and a confirmation message
 */
const getCategories = (req: Request, res: Response, next: Function) => {
  return res.status(200).json({ message: "Fetching board categories..." });
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
 * @returns Status code 201 and a confirmation message
 */
const createCategory = (req: Request, res: Response, next: Function) => {
  return res.status(201).json({ message: "Creating board category..." });
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
