import { Request, Response } from "express";

/**
 * Fetch all threads
 *
 * @returns Status code 200 and a confirmation message
 */
const getThreads = (req: Request, res: Response, next: Function) => {
  return res.status(200).json({ message: "Fetching threads..." });
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
 * @returns Status code 201 and a confirmation message
 */
const createThread = (req: Request, res: Response, next: Function) => {
  return res.status(201).json({ message: "Creating thread..." });
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
