import jwt, { Secret } from "jsonwebtoken";
import UserModel from "../models/user";
import HttpError from "../utils/httpError";
import config from "../config";

/**
 * Log the user in
 *
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 *
 * @returns On success, returns a JSON object containing login information
 */
const login = async (email: string, password: string) => {
  let user;

  try {
    user = await UserModel.findOne({ email });
  } catch (err) {
    throw new HttpError("Login failed. Please try again later.", 500);
  }

  if (!user || !(await user.comparePassword(password))) {
    throw new HttpError("Invalid credentials.", 401);
  }

  let token;
  try {
    token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      config.jwt.key as Secret,
      {
        expiresIn: "1h",
      },
    );
  } catch (err) {
    throw new HttpError("Loggin in failed. Please try again later.", 500);
  }

  return { id: user.id, email: user.email, username: user.username, token };
};

export default { login };
