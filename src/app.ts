import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";

/* Load environment variables */
if (process.env.NODE_ENV !== "production") {
  const configOutput = dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
  if (configOutput.error) {
    throw configOutput.error;
  }
}

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response): void => {
  res.send("Hello World!");
});

app.listen(PORT, (): void => {
  console.log(`Server running here: https://localhost:${PORT}`);
});
