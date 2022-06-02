import { Request, Response } from "express";
import validateRequestInputs from "../../utils/inputValidator";
import HttpError from "../../utils/httpError";
import UserService from "../../services/user";

/**
 * Fetch all users
 *
 * @returns On success, returns an array containing user objects
 */
const getUsers = async (req: Request, res: Response, next: Function) => {
  let users;

  try {
    users = await UserService.getAll();
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(200).json({ users });
};

/**
 * Get a user by their id
 *
 * @param {string} req.params.id The id of the user to fetch
 *
 * @returns On success, returns 200 and a user object
 */
const getUserById = async (req: Request, res: Response, next: Function) => {
  const { id } = req.params;

  let user;
  try {
    user = await UserService.getById(id);
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(200).json({ user });
};

/**
 * Update a user's information
 *
 * @param {string} req.body.username The user's new username
 * @param {string} req.body.email The user's new email address
 * @param {string} req.body.password The user's new password
 * @param {string} req.params.id The id of the user to update
 *
 * @returns On success, returns 200 and an updated user object
 */
const updateUser = async (req: Request, res: Response, next: Function) => {
  const validationError = validateRequestInputs(req);
  if (validationError) {
    return next(validationError);
  }

  const { username, email, password } = req.body;
  const { id } = req.params;

  let user;
  try {
    user = await UserService.update(id, username, email, password);
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(200).json({ user });
};

/**
 * Create a new user account
 *
 * @param {string} req.body.username The user's username
 * @param {string} req.body.email The user's email address
 * @param {string} req.body.password The user's password
 */
const createUser = async (req: Request, res: Response, next: Function) => {
  const validationError = validateRequestInputs(req);
  if (validationError) {
    return next(validationError);
  }

  const { username, email, password } = req.body;

  let userInfo;
  try {
    userInfo = await UserService.create(username, email, password);
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(201).json({ user: userInfo });
};

export default {
  getUsers,
  getUserById,
  updateUser,
  createUser,
};
