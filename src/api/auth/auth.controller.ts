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
 * @returns On success, returns an object containing login information.
 */
const login = async (req: Request, res: Response, next: Function) => {
  const validationError = validateRequestInputs(req);
  if (validationError) {
    return next(validationError);
  }

  const { email, password } = req.body;

  let loginInfo;
  try {
    loginInfo = await AuthService.login(email, password);
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(200).json({ loginInfo });
};

export default { login };
