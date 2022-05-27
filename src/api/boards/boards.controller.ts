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
 * @returns On success, returns 200 and the board object. On failure, returns 404 or 500 and an error message.
 */
const getBoardById = async (req: Request, res: Response, next: Function) => {
  const { id } = req.params;

  let board;
  try {
    board = await BoardService.getById(id);
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(200).json({ board });
};

/**
 * Update a board's info
 *
 * @param req.params.id The id of the board to update
 * @param req.body.topic The new topic for the board
 * @param req.body.description The new description for the board
 * @param req.body.categoryId The id of the category to assign the board to
 *
 * @returns On success, returns 200 and an update board object. On error, returns 500 or 404 depending on the error.
 */
const updateBoard = async (req: Request, res: Response, next: Function) => {
  const validationError = validateRequestInputs(req);
  if (validationError) {
    return next(validationError);
  }

  const { topic, description, categoryId } = req.body;
  const { id } = req.params;

  let board;
  try {
    board = await BoardService.update(id, topic, description, categoryId);
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }
  return res.status(200).json({ board });
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
 *
 * @param {string} req.params.id The id of the board to delete
 */
const deleteBoard = async (req: Request, res: Response, next: Function) => {
  const { id } = req.params;

  let board;
  try {
    board = await BoardService.del(id);
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(200).json({ board });
};

export default {
  getBoards,
  getBoardById,
  updateBoard,
  createBoard,
  deleteBoard,
};
