import express, { Request, Response } from "express";

/**
 * @swagger
 * tags:
 *   name: Health Check
 *   description: Endpoint for checking application state
 */

interface Data {
  uptime: number;
  message: String | unknown;
  timestamp: number;
}

const router: express.Router = express.Router();

/**
 * @swagger
 * /healthCheck:
 *   get:
 *     summary: Check application health
 *     tags: [Health Check]
 *     responses:
 *       200:
 *         description: The application is ok
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             properties:
 *               uptime:
 *                 type: number
 *               message:
 *                 type: string
 *               timestamp:
 *                 type: number
 */
router.get("/", (req: Request, res: Response, next: Function) => {
  const data: Data = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };

  try {
    res.status(200).json({ data: data });
  } catch (err) {
    data.message = err;
    res.status(503).send();
  }
});

export default router;
