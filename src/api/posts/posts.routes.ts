import express from "express";
import controller from "./posts.controller";

/**
 * @swagger
 * components:
 *   schemas:
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
 *     ThreadRef:
 *       type: object
 *       required:
 *         - id
 *         - topic
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the thread
 *         topic:
 *           type: string
 *           description: The name of the thread
 *     Post:
 *       type: object
 *       required:
 *         - _id
 *         - content
 *         - dateCreated
 *         - author
 *         - thread
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the post
 *         content:
 *           type: string
 *           description: The text content of the post
 *         dateCreated:
 *           type: string
 *           format: date-time
 *           description: The date and time that the post was created
 *         author:
 *           $ref: "#/components/schemas/UserRef"
 *         thread:
 *           $ref: "#/components/schemas/ThreadRef"
 *   requestBodies:
 *     PostBody:
 *       description: A JSON object containing post information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - authorId
 *               - threadId
 *             properties:
 *               content:
 *                 type: string
 *                 description: The text content of the post
 *               authorId:
 *                 type: string
 *                 description: The auto-generated id of the post's creator
 *               threadId:
 *                 type: string
 *                 description: The auto-generated id of the thread that the post belongs to
 * tags:
 *   name: Posts
 *   description: Operations on posts
 *
 */

const router: express.Router = express.Router();

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: The list of all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Post"
 */
router.get("/", controller.getPosts);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       $ref: "#/components/requestBodies/PostBody"
 *     responses:
 *       201:
 *         description: The post was created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Post"
 */
router.post("/", controller.createPost);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by its id
 *     tags: [Posts]
 *     parameters:
 *       - in : path
 *         name: id
 *         description: id of the post
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: A post object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Post"
 *       404:
 *         description: Post connot be found
 */
router.get("/:id", controller.getPostById);

/**
 * @swagger
 * /posts/{id}:
 *   patch:
 *     summary: Update a post's information
 *     tags: [Posts]
 *     parameters:
 *       - in : path
 *         name: id
 *         description: id of the post
 *         schema:
 *           type: string
 *           example: 12cew34d224r7d
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: The post was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Post"
 */
router.patch("/:id", controller.updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     parameters:
 *       - in : path
 *         name: id
 *         description: id of the post
 *         schema:
 *           type: string
 *           example: 12cew34d224r7d
 *         required: true
 *     responses:
 *       200:
 *         description: The post was deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Post"
 */
router.delete("/:id", controller.deletePost);

router.get("/user/:id", controller.getPostsByUser);

router.get("/thread/:id", controller.getPostsByThread);

export default router;
