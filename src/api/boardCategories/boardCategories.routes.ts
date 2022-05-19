import express from "express";
import { check } from "express-validator";
import controller from "./boardCategories.controller";

/**
 * @swagger
 * components:
 *   schemas:
 *     BoardCategory:
 *       type: object
 *       required:
 *         - _id
 *         - topic
 *         - boards
 *         - sortOrder
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the category
 *         topic:
 *           type: string
 *           description: The name of the category
 *         boards:
 *           type: array
 *           description: A list of boards that belong to the category
 *           items:
 *             type: string
 *         sortOrder:
 *           type: number
 *           description: The position in which to sort the category
 *   requestBodies:
 *     CategoryBody:
 *       description: A JSON object containing category information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *               - sortOrder
 *             properties:
 *               topic:
 *                 type: string
 *                 description: The name of the category
 *               sortOrder:
 *                 type: number
 *                 description: The order in which to sort the category
 * tags:
 *   name: BoardCategories
 *   description: Operations on board categories
 */

const router: express.Router = express.Router();

/**
 * @swagger
 * /boardCategories:
 *   get:
 *     summary: Get all board categories
 *     tags: [BoardCategories]
 *     responses:
 *       200:
 *         description: The list of all board categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/BoardCategory"
 *       500:
 *         description: Unable to fetch board categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unable to fetch board categories
 */
router.get("/", controller.getCategories);

/**
 * @swagger
 * /boardCategories:
 *   post:
 *     summary: Create a new board category
 *     tags: [BoardCategories]
 *     requestBody:
 *       $ref: "#/components/requestBodies/CategoryBody"
 *     responses:
 *       201:
 *         description: The category was created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Board category created successfully
 */
router.post(
  "/",
  [check("topic").not().isEmpty()],
  [check("sortOrder").isNumeric()],
  controller.createCategory,
);

/**
 * @swagger
 * /boardCategories/{id}:
 *   get:
 *     summary: Get a board category by its id
 *     tags: [BoardCategories]
 *     parameters:
 *       - in : path
 *         name: id
 *         description: id of the category
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: A board category object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BoardCategory"
 *       404:
 *         description: Board category connot be found
 */
router.get("/:id", controller.getCategoryById);

/**
 * @swagger
 * /boardCategories/{id}:
 *   patch:
 *     summary: Update a board category's information
 *     tags: [BoardCategories]
 *     parameters:
 *       - in : path
 *         name: id
 *         description: id of the board category
 *         schema:
 *           type: string
 *           example: 12cew34d224r7d
 *         required: true
 *     responses:
 *       200:
 *         description: The board category was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Board category updated successfully
 */
// TODO: document request body
router.patch("/:id", controller.updateCategory);

/**
 * @swagger
 * /boardCategories/{id}:
 *   delete:
 *     summary: Delete a board category
 *     tags: [BoardCategories]
 *     responses:
 *       200:
 *         description: The board category was deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Board category deleted successfully
 */
router.delete("/:id", controller.deleteCategory);

export default router;
