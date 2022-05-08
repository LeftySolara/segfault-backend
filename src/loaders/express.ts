import express, { Application } from "express";
import api from "../api";

export default async ({ app }: { app: Application }) => {
  app.use("/users", api.users);

  return app;
};
