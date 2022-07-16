import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import { Application, Request, Response } from "express";

import api from "../api";
import config from "../config";
import HttpError from "../utils/httpError";

export default async ({ app }: { app: Application }) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // add CORS headers to all responses
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(config.swagger));

  app.use("/users", api.users);
  app.use("/boardCategories", api.boardCategories);
  app.use("/boards", api.boards);
  app.use("/threads", api.threads);
  app.use("/posts", api.posts);
  app.use("/auth", api.auth);
  app.use("/healthCheck", api.healthCheck);

  // Default error handling function
  // Express will execute for any middleware that has an error
  app.use((error: HttpError, req: Request, res: Response, next: Function) => {
    if (res.headersSent) {
      return next(error);
    }
    res.status(error.code || 500);
    return res.json({ message: error.message || "An unknown error occurred." });
  });

  return app;
};
