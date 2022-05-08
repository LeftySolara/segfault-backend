import express, { Application } from "express";
import routes from "../api/routes";

export default async ({ app }: { app: Application }) => {
  app.use("/users", routes.users);

  return app;
};
