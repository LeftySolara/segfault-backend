import express from "express";
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thread created successfully
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
 *       400:
 *         description: Thread connot be found
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thread updated successfully
 */
// TODO: document request body
router.patch("/:id", controller.updateThread);

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

export default router;
