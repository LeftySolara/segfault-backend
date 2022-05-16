import express from "express";
import controller from "./boards.controller";

/**
 * @swagger
 * components:
 *   schemas:
 *     BoardCategoryRef:
 *       type: object
 *       required:
 *         - id
 *         - topic
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the board category
 *         topic:
 *           type: string
 *           description: The name of the board category
 *     Board:
 *       type: object
 *       required:
 *         - _id
 *         - topic
 *         - description
 *         - threads
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the board
 *         topic:
 *           type: string
 *           description: The name of the board
 *         description:
 *           type: string
 *           description: A brief description of the board topic
 *         threads:
 *           type: array
 *           description: A list of threads that belong to this board
 *           items:
 *             type: string
 *         category:
 *           $ref: "#/components/schemas/BoardCategoryRef"
 *   requestBodies:
 *     BoardBody:
 *       description: A JSON object containing board information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *               - description
 *               - categoryId
 *             properties:
 *               topic:
 *                 type: string
 *                 description: The name of the board
 *               description:
 *                 type: string
 *                 description: A brief description of the board topic
 *               categoryId:
 *                 type: string
 *                 description: The id of the category to assign the board to
 * tags:
 *   name: Boards
 *   description: Operations on boards
 *
 */

const router: express.Router = express.Router();

/**
 * @swagger
 * /boards:
 *   get:
 *     summary: Get all boards
 *     tags: [Boards]
 *     responses:
 *       200:
 *         description: The list of all boards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Board"
 */
router.get("/", controller.getBoards);

/**
 * @swagger
 * /boards:
 *   post:
 *     summary: Create a new board
 *     tags: [Boards]
 *     requestBody:
 *       $ref: "#/components/requestBodies/BoardBody"
 *     responses:
 *       201:
 *         description: The board was created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Board created successfully
 */
router.post("/", controller.createBoard);

/**
 * @swagger
 * /boards/{id}:
 *   get:
 *     summary: Get a board by its id
 *     tags: [Boards]
 *     parameters:
 *       - in : path
 *         name: id
 *         description: id of the board
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: A board object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Board"
 *       400:
 *         description: Board connot be found
 */
router.get("/:id", controller.getBoardById);

/**
 * @swagger
 * /boards/{id}:
 *   patch:
 *     summary: Update a board's information
 *     tags: [Boards]
 *     parameters:
 *       - in : path
 *         name: id
 *         description: id of the category
 *         schema:
 *           type: string
 *           example: 12cew34d224r7d
 *         required: true
 *     responses:
 *       200:
 *         description: The board was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Board updated successfully
 */
// TODO: document request body
router.patch("/:id", controller.updateBoard);

/**
 * @swagger
 * /boards/{id}:
 *   delete:
 *     summary: Delete a board
 *     tags: [Boards]
 *     responses:
 *       200:
 *         description: The board was deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Board deleted successfully
 */
router.delete("/:id", controller.deleteBoard);

export default router;