import express from "express";
import { check } from "express-validator";
import controller from "./threads.controller";

/**
 * @swagger
 * components:
 *   schemas:
 *     BoardRef:
 *       type: object
 *       required:
 *         - id
 *         - topic
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the board
 *         topic:
 *           type: string
 *           description: The name of the board
 *     UserRef:
 *        type: object
 *        required:
 *          - id
 *          - username
 *          - email
 *        properties:
 *          id:
 *            type: string
 *            description: The auto-generated id of the user
 *          username:
 *            type: string
 *            description: The user's username
 *          email:
 *            type: string
 *            description: The user's email address
 *     Thread:
 *       type: object
 *       required:
 *         - _id
 *         - topic
 *         - dateCreated
 *         - author
 *         - posts
 *         - lastPost
 *         - board
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the thread
 *         topic:
 *           type: string
 *           description: The name of the thread
 *         dateCreated:
 *           type: string
 *           format: date-time
 *           description: The date and time that the thread was created
 *         author:
 *           $ref: "#/components/schemas/UserRef"
 *         posts:
 *           type: array
 *           description: A list of posts that belong to the thread
 *           items:
 *             type: string
 *         lastPost:
 *           type: string
 *           description: The id of the thread's most recent post
 *         board:
 *           $ref: "#/components/schemas/BoardRef"
 *   requestBodies:
 *     ThreadBody:
 *       description: A JSON object containing thread information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *               - authorId
 *               - boardId
 *             properties:
 *               topic:
 *                 type: string
 *                 description: The name of the thread
 *               authorId:
 *                 type: string
 *                 description: The id of the thread's creator
 *               boardId:
 *                 type: string
 *                 description: The id of the board this thread belongs to
 * tags:
 *   name: Threads
 *   description: Operations on threads
 *
 */

const router: express.Router = express.Router();

/**
 * @swagger
 * /threads:
 *   get:
 *     summary: Get all threads
 *     tags: [Threads]
 *     responses:
 *       200:
 *         description: The list of all threads
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Thread"
 */
router.get("/", controller.getThreads);

/**
 * @swagger
 * /threads:
 *   post:
 *     summary: Create a new thread
 *     tags: [Threads]
 *     requestBody:
 *       $ref: "#/components/requestBodies/ThreadBody"
 *     responses:
 *       201:
 *         description: The thread was created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Thread"
 *       404:
 *         description: The board or author could not be found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Could not find board or author
 */
router.post("/", controller.createThread);

/**
 * @swagger
 * /threads/{id}:
 *   get:
 *     summary: Get a thread by its id
 *     tags: [Threads]
 *     parameters:
 *       - in : path
 *         name: id
 *         description: id of the thread
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: A thread object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Thread"
 *       404:
 *         description: Thread connot be found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thread not found
 */
router.get("/:id", controller.getThreadById);

/**
 * @swagger
 * /threads/{id}:
 *   patch:
 *     summary: Update a thread's information
 *     tags: [Threads]
 *     parameters:
 *       - in : path
 *         name: id
 *         description: id of the thread
 *         schema:
 *           type: string
 *           example: 12cew34d224r7d
 *         required: true
 *     responses:
 *       200:
 *         description: The thread was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Thread"
 *       404:
 *         description: The thread was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thread not found
 *     requestBody:
 *       description: A JSON-formatted object containing thread information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *                 description: The new topic of the thread
 */
router.patch("/:id", [check("topic").not().isEmpty()], controller.updateThread);

/**
 * @swagger
 * /threads/{id}:
 *   delete:
 *     summary: Delete a thread
 *     tags: [Threads]
 *     responses:
 *       200:
 *         description: The thread was deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thread deleted successfully
 */
router.delete("/:id", controller.deleteThread);

/**
 * @swagger
 * /threads/user/{id}:
 *   get:
 *     summary: Fetch all threads created by a specific user
 *     tags: [Threads]
 *     parameters:
 *       - in : path
 *         name: id
 *         description: The id of the user to search for
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: A list of the user's threads
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 threads:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Thread"
 *       404:
 *         description: The user was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 */
router.get("/user/:id", controller.getThreadsByUser);

export default router;
