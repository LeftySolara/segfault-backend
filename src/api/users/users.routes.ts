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
 *           format: email
 *           description: The user's email address
 *         password:
 *           type: string
 *           format: password
 *           description: The user's hashed password
 *         joinDate:
 *           type: string
 *           format: date-time
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
 *   requestBodies:
 *     UserBody:
 *       description: A JSON object containing user information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/User"
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

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Gets a user based on their id
 *     tags: [Users]
 *     parameters:
 *       - in : path
 *         name: id
 *         description: id of the user
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       400:
 *         description: User cannot be found
 */
router.get("/:id", controller.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update a user's information
 *     tags: [Users]
 *     parameters:
 *       - in : path
 *         name: id
 *         description: id of the user
 *         schema:
 *           type: string
 *           example: 12cew34d224r7d
 *         required: true
 *     responses:
 *       200:
 *         description: The user was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 */
// TODO: document request body
router.patch("/:id", controller.updateUser);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       $ref: "#/components/requestBodies/UserBody"
 *     responses:
 *       201:
 *         description: The user was created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 */
router.post("/", controller.createUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The user was deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 */
router.delete("/:id", controller.deleteUser);

export default router;
