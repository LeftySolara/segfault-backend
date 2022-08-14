import { Request, Response } from "express";

import validateRequestInputs from "../../utils/inputValidator";
import HttpError from "../../utils/httpError";
import ThreadService, {
  ThreadSortDirection,
  ThreadSortField,
} from "../../services/thread";

/**
 * Get all threads from the database
 *
 * @returns On success, returns status code 200 and an array of thread objects
 */
const getThreads = async (req: Request, res: Response, next: Function) => {
  let field, direction;
  let threadLimit = 0;

  if (req.query) {
    const { sort, limit } = req.query;

    if (limit) {
      threadLimit = parseInt(limit as string);
    }

    if (sort) {
      [field, direction] = (sort as string).split(":");
      direction = direction === "asc" ? 1 : -1;
    }
  }

  let threads;
  try {
    threads = await ThreadService.getAll(
      field as ThreadSortField,
      direction as ThreadSortDirection,
      threadLimit,
    );
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(200).json({ threads });
};

/**
 * Fetch a thread by its ID
 *
 * @param {string} req.params.id The id of the thread to fetch
 *
 * @returns On success, returns 200 and a thread object
 */
const getThreadById = async (req: Request, res: Response, next: Function) => {
  const { id } = req.params;
  let thread;

  try {
    thread = await ThreadService.getById(id);
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(200).json({ thread });
};

/**
 * Fetch all threads created by a specific user
 *
 * @param {string} req.params.id - The id of the user
 *
 * @returns An array of thread objects
 */
const getThreadsByUser = async (
  req: Request,
  res: Response,
  next: Function,
) => {
  const { id } = req.params;

  let threads;
  try {
    threads = await ThreadService.getByUser(id);
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(200).json({ threads });
};

/**
 * Fetch all threads from a specific board
 *
 * @param {string} req.params.id - The id of the board
 *
 * @returns An array of thread objects
 */
const getThreadsByBoard = async (
  req: Request,
  res: Response,
  next: Function,
) => {
  let field, direction;
  let threadLimit = 0;

  if (req.query) {
    const { sort, limit } = req.query;

    if (limit) {
      threadLimit = parseInt(limit as string);
    }

    if (sort) {
      [field, direction] = (sort as string).split(":");
      direction = direction === "asc" ? 1 : -1;
    }
  }

  const { id } = req.params;

  let threads;
  try {
    threads = await ThreadService.getByBoard(
      id,
      field as ThreadSortField,
      direction as ThreadSortDirection,
      threadLimit,
    );
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(200).json({ threads });
};

/**
 * Update a thread's information
 *
 * @param {string} req.params.id - The id of the thread to update
 * @param {string} req.body.topic - The new topic to assign to the thread
 *
 * @returns On success, returns 200 and an updated thread object
 */
const updateThread = async (req: Request, res: Response, next: Function) => {
  const validationError = validateRequestInputs(req);
  if (validationError) {
    return next(validationError);
  }

  const { id } = req.params;
  const { topic } = req.body;

  let thread;
  try {
    thread = await ThreadService.update(id, topic);
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(200).json({ thread });
};

/**
 * Create a new thread
 *
 * @param {string} req.body.authorId - The id of the thread's creator
 * @param {string} req.body.boardId - The id of the board that the thread belongs to
 * @param {string} req.body.topic - The title of the thread
 *
 * @returns On success, returns 201 and a thread object
 */
const createThread = async (req: Request, res: Response, next: Function) => {
  const validationError = validateRequestInputs(req);
  if (validationError) {
    return next(validationError);
  }

  const { authorId, boardId, topic } = req.body;

  let thread;
  try {
    thread = await ThreadService.create(authorId, boardId, topic);
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(201).json({ thread });
};

/**
 * Delete a thread
 *
 * @param {string} req.params.id - The id of the thread to delete
 */
const deleteThread = async (req: Request, res: Response, next: Function) => {
  const { id } = req.params;

  let thread;
  try {
    thread = await ThreadService.del(id);
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(200).json({ thread });
};

export default {
  getThreads,
  getThreadById,
  getThreadsByUser,
  getThreadsByBoard,
  updateThread,
  createThread,
  deleteThread,
};
