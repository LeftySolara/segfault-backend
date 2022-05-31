import jwt, { Secret } from "jsonwebtoken";
import UserModel from "../models/user";
import HttpError from "../utils/httpError";
import config from "../config";

/**
 * Check whether the given user already exists
 *
 * @param {string} username The user's username
 * @param {string} email The user's email address
 * @returns True if the user exists, false otherwise
 */
const userExists = async (username: string, email: string) => {
  let existingUser;

  try {
    existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
  } catch (err) {
    throw new HttpError("Faild to look up user", 500);
  }

  return !!existingUser;
};

/**
 * Create a new user account
 *
 * @param {string} username The user's display name
 * @param {string} email The user's email address
 * @param {string} password The user's password
 *
 * @returns An object containing the new user's information
 */
const create = async (username: string, email: string, password: string) => {
  try {
    if (await userExists(username, email)) {
      throw new HttpError("User exists", 422);
    }
  } catch (err) {
    throw err;
  }

  const createdUser = new UserModel({
    username,
    email,
    password,
    joinDate: Date.now(),
    posts: [],
    threads: [],
  });

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      config.jwt.key as Secret,
      { expiresIn: "1h" },
    );
  } catch (err) {
    throw new HttpError("Registration failed", 500);
  }

  try {
    await createdUser.save();
  } catch (err) {
    throw new HttpError("Failed to create user. Please try again.", 500);
  }

  return {
    userId: createdUser.id,
    username: createdUser.username,
    email: createdUser.email,
    token,
  };
};

export default { create };
