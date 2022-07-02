import express from "express";
import { check } from "express-validator";
import controller from "./posts.controller";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRef:
 *        type: object
 *        required:
 *          - authorId
 *          - username
 *          - email
 *        properties:
 *          authorId:
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
 *         - threadId
 *         - topic
 *       properties:
 *         threadId:
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
router.post(
  "/",
  [
    check("content").not().isEmpty(),
    check("authorId").not().isEmpty(),
    check("threadId").not().isEmpty(),
  ],
  controller.createPost,
);

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
router.patch("/:id", [check("content").not().isEmpty()], controller.updatePost);

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

/**
 * @swagger
 * /posts/user/{id}:
 *   get:
 *     summary: Get all of a user's posts
 *     tags: [Posts]
 *     parameters:
 *       - in : path
 *         name: id
 *         description: the id of the user
 *         schema:
 *           type: string
 *           example: 12cew34d224r7d
 *         required: true
 *     responses:
 *       200:
 *         description: A list of the user's posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Post"
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
router.get("/user/:id", controller.getPostsByUser);

/**
 * @swagger
 * /posts/thread/{id}:
 *   get:
 *     summary: Get all of a thread's posts
 *     tags: [Posts]
 *     parameters:
 *       - in : path
 *         name: id
 *         description: the id of the thread
 *         schema:
 *           type: string
 *           example: 12cew34d224r7d
 *         required: true
 *     responses:
 *       200:
 *         description: A list of the thread's posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Post"
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
 */
router.get("/thread/:id", controller.getPostsByThread);

export default router;
