import express from "express";
import { check } from "express-validator";
import controller from "./auth.controller";

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginInfo:
 *       type: object
 *       required:
 *         - userId
 *         - email
 *         - username
 *         - token
 *       properties:
 *         userId:
 *           type: string
 *           description: The user's id
 *         email:
 *           type: string
 *           description: The user's email address
 *         username:
 *           type: string
 *           description: The user's username
 *         token:
 *           type: string
 *           description: A signed JWT key for this login session
 *   requestBodies:
 *     LoginBody:
 *       description: A JSON object containing user credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 description: The user's password
 * tags:
 *   name: Auth
 *   description: Operations for handling login sessions
 */

const router: express.Router = express.Router();
0;
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       $ref: "#/components/requestBodies/LoginBody"
 *     responses:
 *       200:
 *         description: The user successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LoginInfo"
 *       401:
 *         description: The credentials were invalid
 */
router.post(
  "/login",
  [check("email").isEmail()],
  [check("password").not().isEmpty()],
  controller.login,
);

export default router;
