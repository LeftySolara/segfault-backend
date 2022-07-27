import { Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../config";

/**
 * Authorization middleware
 *
 * This middleware function verifies the JWT stored in the request cookie
 * and determines whether a user is authorized to receive account information.
 *
 * @returns On failure, returns status code 401. On success, calls the next middleware function.
 */
const authorize = (req: Request, res: Response, next: Function) => {
  const token = req.cookies.token;
  if (!token) {
    return res.sendStatus(401);
  }
  try {
    const data = jwt.verify(token, config.jwt.key as Secret) as JwtPayload;
    req.userId = data.userId;
    req.email = data.email;
    req.username = data.username;
    next();
  } catch (err: unknown) {
    return res.sendStatus(401);
  }
};

export default authorize;
