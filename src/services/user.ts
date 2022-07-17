import jwt, { Secret } from "jsonwebtoken";
import UserModel from "../models/user";
import HttpError from "../utils/httpError";
import config from "../config";

interface UserCheck {
  exists: boolean; // Whether or not the user exists
  usernameMatch: boolean; // Whether the existing user's username matches
  emailMatch: boolean; // Whether the existing user's email matches
}

/**
 * Check whether the given user already exists
 *
 * @param {string} username The user's username
 * @param {string} email The user's email address
 *
 * @returns An object specifying whether the user exists and which fields match
 */
const userExists = async (username: string, email: string) => {
  let existingUser;
  let userCheck: UserCheck = {
    exists: false,
    usernameMatch: false,
    emailMatch: false,
  };

  try {
    existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      userCheck.exists = true;
      if (existingUser.username === username) {
        userCheck.usernameMatch = true;
      }
      if (existingUser.email === email) {
        userCheck.emailMatch = true;
      }
    }
  } catch (err) {
    throw new HttpError("Faild to look up user", 500);
  }

  return userCheck;
};

/**
 * Fetch a list of all users
 *
 * @returns An array containing user objects
 */
const getAll = async () => {
  let users;

  try {
    users = await UserModel.find({}, "-password");
  } catch (err) {
    throw new HttpError("Failed to fetch users", 500);
  }

  return users.map((user) => user.toObject({ getters: true }));
};

/**
 * Fetch a user based on their id
 *
 * @param {string} id The id of the user to fetch
 *
 * @returns On success, returns an object containing user information
 */
const getById = async (id: string) => {
  let user;

  try {
    user = await UserModel.findById(id, "-password");
  } catch (err: unknown) {
    throw new HttpError("Unable to fetch user", 500);
  }

  if (!user) {
    throw new HttpError(`Could not find user with id ${id}`, 404);
  }

  return user.toObject({ getters: true });
};

/**
 * Update a user's information
 *
 * @param {string} id The user's id
 * @param {string} username The user's new username
 * @param {string} email The user's new email address
 * @param {string} password The user's new password
 *
 * @returns An object containing updated user information
 */
const update = async (
  id: string,
  username: string,
  email: string,
  password: string,
) => {
  let user;

  try {
    user = await UserModel.findById(id);
  } catch (err: unknown) {
    throw new HttpError("Unable to fetch user", 500);
  }

  if (!user) {
    throw new HttpError("Could not find user with specified id", 404);
  }

  user.username = username;
  user.email = email;
  user.password = password;

  try {
    await user.save({ validateModifiedOnly: true });
  } catch (err: unknown) {
    throw new HttpError("Unable to update user information", 500);
  }

  /* Here we manually remove the password property from the returned user object.
   * This does not affect the password field in the document stored in the database.
   *
   * We do this because mongoose's toObject() method fetches all fields of a document regardless
   * of the projection specified in the previous find() call. So, for example, calling
   * user = User.findById(userId, "-password") will fetch the document with the correct projection,
   * but the following user.toObject() call will re-add the password property.
   */
  const returnedUser: any = user.toObject({ getters: true });
  delete returnedUser.password;

  return returnedUser;
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
  let userCheck: UserCheck;

  // Check whether the user already exists
  try {
    userCheck = await userExists(username, email);
    let msg: string;

    if (userCheck.exists) {
      if (userCheck.emailMatch && userCheck.usernameMatch) {
        msg = "Email address and username already in use";
      } else if (userCheck.emailMatch) {
        msg = "Email address already in use";
      } else if (userCheck.usernameMatch) {
        msg = "Username already in use";
      } else {
        msg = "Failed to create user. Please try again."; // If things are working properly, this should NEVER happen
      }
      throw new HttpError(msg, 422);
    }
  } catch (err) {
    if (err instanceof HttpError) {
      throw new HttpError(err.message, err.code);
    }
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

export default { getAll, getById, update, create };
