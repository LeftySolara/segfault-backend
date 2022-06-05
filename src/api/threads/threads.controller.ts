import { Request, Response } from "express";

import validateRequestInputs from "../../utils/inputValidator";
import HttpError from "../../utils/httpError";
import ThreadService from "../../services/thread";

/**
 * Get all threads from the database
 *
 * @returns On success, returns status code 200 and an array of thread objects
 */
const getThreads = async (req: Request, res: Response, next: Function) => {
  let threads;

  try {
    threads = await ThreadService.getAll();
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
 * @returns Status code 200 and a confirmation message
 */
const getThreadById = (req: Request, res: Response, next: Function) => {
  return res.status(200).json({ message: "Fetching thread..." });
};

/**
 * Update a thread's info
 *
 * @returns Status code 200 and a confirmation message
 */
const updateThread = (req: Request, res: Response, next: Function) => {
  return res.status(200).json({ message: "Updating thread..." });
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
 */
const deleteThread = (req: Request, res: Response, next: Function) => {
  return res.status(200).json({ message: "Deleting thread..." });
};

export default {
  getThreads,
  getThreadById,
  updateThread,
  createThread,
  deleteThread,
};
