import { Request, Response } from "express";
import HttpError from "../../utils/httpError";
import validateRequestInputs from "../../utils/inputValidator";
import AuthService from "../../services/auth";

/**
 * Log the user in
 *
 * @param {string} req.body.email - The user's email address
 * @param {string} req.body.password - The user's password
 *
 * @returns On success, returns an object containing user information.
 */
const login = async (req: Request, res: Response, next: Function) => {
  const validationError = validateRequestInputs(req);
  if (validationError) {
    return next(validationError);
  }

  const { email, password } = req.body;

  let user;
  try {
    user = await AuthService.login(email, password);
    res.cookie("token", user.token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  if (user) {
    return res.status(200).json({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  } else {
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Log the user out
 *
 * @returns Status code 200 and a message verifying that the logout was successful
 */
const logout = async (req: Request, res: Response, next: Function) => {
  return res
    .clearCookie("token")
    .status(200)
    .json({ message: "Successfully logged out" });
};

/**
 * Fetch the currently logged-in user's login information.
 *
 * @returns An object containing user login information
 */
const getUser = async (req: Request, res: Response, next: Function) => {
  return res.status(200).json({
    user: {
      id: req.userId,
      email: req.email,
      username: req.username,
    },
  });
};

export default { login, logout, getUser };
