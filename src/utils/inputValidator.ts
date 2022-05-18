import { Request } from "express";
import { validationResult, Result, ValidationError } from "express-validator";
import loggerService from "../services/logger";
import HttpError from "./httpError";

const validateRequestInputs = (req: Request): HttpError | undefined => {
  const result: Result<ValidationError> = validationResult(req);
  let err: HttpError | undefined;

  if (!result.isEmpty()) {
    loggerService.error(
      `Invalid inputs passed for ${req.method} request at ${req.originalUrl}`,
    );
    err = new HttpError(result.array({ onlyFirstError: true })[0].msg, 422);
  }

  return err;
};

export default validateRequestInputs;
