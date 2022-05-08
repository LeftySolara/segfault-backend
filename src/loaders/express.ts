import { Application } from "express";
import swaggerUi from "swagger-ui-express";

import api from "../api";
import config from "../config";

export default async ({ app }: { app: Application }) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(config.swagger));

  app.use("/users", api.users);

  return app;
};
