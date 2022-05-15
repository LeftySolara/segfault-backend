import { Request, Response } from "express";

/**
 * Fetch all boards
 *
 * @returns Status code 200 and a confirmation message
 */
const getBoards = (req: Request, res: Response, next: Function) => {
  return res.status(200).json({ message: "Fetching boards..." });
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
 * @returns Status code 201 and a confirmation message
 */
const createBoard = (req: Request, res: Response, next: Function) => {
  return res.status(201).json({ message: "Creating board..." });
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
