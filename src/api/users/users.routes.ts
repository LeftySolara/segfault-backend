import express from "express";
import controller from "./usersController";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - _id
 *         - username
 *         - email
 *         - password
 *         - joinDate
 *         - posts
 *         - threads
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of a user
 *         username:
 *           type: string
 *           description: The user's username
 *         email:
 *           type: string
 *           description: The user's email address
 *         password:
 *           type: string
 *           description: The user's hashed password
 *         joinDate:
 *           type: string
 *           format: date
 *           description: The date and time that the user joined
 *         posts:
 *           type: array
 *           description: Array of IDs of the user's posts
 *           items:
 *             type: string
 *         threads:
 *           type: array
 *           description: Array of IDs of the user's threads
 *           items:
 *             type: string
 * tags:
 *   name: Users
 *   description: Operations on user accounts
 */

const router: express.Router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/User"
 */
router.get("/", controller.getUsers);

export default router;
