import { Request, Response } from "express";
import HttpError from "../../utils/httpError";
import validateRequestInputs from "../../utils/inputValidator";
import PostService from "../../services/post";

/**
 * Fetch all posts
 *
 * @returns On success, returns status code 200 and an array of post objects
 */
const getPosts = async (req: Request, res: Response, next: Function) => {
  let posts;

  try {
    posts = await PostService.getAll();
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(200).json({ posts });
};

/**
 * Fetch a post by its id
 *
 * @param {string} req.params.id - The id of the post to fetch
 *
 * @returns On success, returns status code 200 and a post object
 */
const getPostById = async (req: Request, res: Response, next: Function) => {
  const { id } = req.params;
  let post;

  try {
    post = await PostService.getById(id);
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(200).json({ post });
};

/**
 * Fetch all posts created by a specific user
 *
 * @param {string} req.params.id - The id of the user
 *
 * @returns On success, returns status code 200 and an array of post objects
 */
const getPostsByUser = async (req: Request, res: Response, next: Function) => {
  const { id } = req.params;
  let posts;

  try {
    posts = await PostService.getByUser(id);
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(200).json({ posts });
};

/**
 * Fetch all posts from a specific thread
 *
 * @param req.params.id The id of the thread to fetch posts from
 *
 * @returns On success, returns status code 200 and an array of post objects
 */
const getPostsByThread = async (
  req: Request,
  res: Response,
  next: Function,
) => {
  const { id } = req.params;
  let posts;

  try {
    posts = await PostService.getByThread(id);
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(200).json({ posts });
};

/**
 * Update a post's info
 *
 * @param req.params.id The id of the post to update
 * @param req.body.content The new content to use in the post
 *
 * @returns On success, returns status code 200 and an updated post object
 */
const updatePost = async (req: Request, res: Response, next: Function) => {
  const validationError = validateRequestInputs(req);
  if (validationError) {
    return next(validationError);
  }

  const { id } = req.params;
  const { content } = req.body;

  let post;
  try {
    post = await PostService.update(id, content);
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(200).json({ post });
};

/**
 * Create a new post
 *
 * @param {string} req.body.authorId - The id of the user creating the post
 * @param {string} req.body.threadId - The id of the thread the post belongs to
 * @param {string} req.body.content - The text content of the post
 *
 * @returns On success, returns status code 201 and a post object
 */
const createPost = async (req: Request, res: Response, next: Function) => {
  const validationError = validateRequestInputs(req);
  if (validationError) {
    return next(validationError);
  }

  const { authorId, threadId, content } = req.body;

  let post;
  try {
    post = await PostService.create(authorId, threadId, content);
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(201).json({ post });
};

/**
 * Delete a post
 *
 * @param {string} req.params.id - The id of the post to delete
 *
 * @returns On succes, returns status code 200 and an object containing the deleted post's information
 */
const deletePost = async (req: Request, res: Response, next: Function) => {
  const { id } = req.params;

  let post;
  try {
    post = await PostService.del(id);
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }
  }

  return res.status(200).json({ post });
};

export default {
  getPosts,
  getPostById,
  getPostsByUser,
  getPostsByThread,
  updatePost,
  createPost,
  deletePost,
};
