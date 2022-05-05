import config from "./config";
import express, { Request, Response, Application } from "express";

const app: Application = express();
const PORT = config.port || 8000;

app.get("/", (req: Request, res: Response): void => {
  res.send("Hello World!");
});

app.listen(PORT, (): void => {
  console.log(`Server running here: https://localhost:${PORT}`);
});
