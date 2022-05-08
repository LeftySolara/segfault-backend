import express, { Request, Response } from "express";

const router: express.Router = express.Router();

router.get("/", (req: Request, res: Response): void => {
  res.status(200).json({ message: "Fetching all users..." });
});

router.get("/:userId", (req: Request, res: Response): void => {
  const { userId } = req.params;
  res.status(200).json({ message: `Fetching user ${userId}...` });
});

export default router;
