import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

import api from "../api";
import config from "../config";

export default async ({ app }: { app: Application }) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(config.swagger));

  app.use("/users", api.users);

  return app;
};
