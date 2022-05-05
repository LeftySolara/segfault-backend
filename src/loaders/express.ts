import express, { Request, Response, Application } from "express";

export default async ({ app }: { app: Application }) => {
  app.get("/", (req: Request, res: Response): void => {
    res.send("Hello World!");
  });

  return app;
};
