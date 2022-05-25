import { Request, Response } from "express";
import BoardService from "../../services/board";
import HttpError from "../../utils/httpError";
import validateRequestInputs from "../../utils/inputValidator";

/**
 * Fetch all boards
 *
 * @returns Status code 200 and an array of board objects
 */
const getBoards = async (req: Request, res: Response, next: Function) => {
  let boards;

  try {
    boards = await BoardService.getAll();
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(200).json({ boards });
};

/**
 * Fetch a board by its ID
 *
 * @returns Status code 200 and a confirmation message
 */
const getBoardById = (req: Request, res: Response, next: Function) => {
  return res.status(200).json({ message: "Fetching board..." });
};

/**
 * Update a board's info
 *
 * @returns Status code 200 and a confirmation message
 */
const updateBoard = (req: Request, res: Response, next: Function) => {
  return res.status(200).json({ message: "Updating board..." });
};

/**
 * Create a new board
 *
 * @returns Status code 201 and the new board object
 */
const createBoard = async (req: Request, res: Response, next: Function) => {
  const validationError = validateRequestInputs(req);
  if (validationError) {
    return next(validationError);
  }

  const { topic, description, categoryId } = req.body;
  let board;

  try {
    board = await BoardService.create(topic, description, categoryId);
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(201).json({ board });
};

/**
 * Delete a board
 */
const deleteBoard = (req: Request, res: Response, next: Function) => {
  return res.status(200).json({ message: "Deleting board..." });
};

export default {
  getBoards,
  getBoardById,
  updateBoard,
  createBoard,
  deleteBoard,
};
