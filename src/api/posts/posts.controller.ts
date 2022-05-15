import { Request, Response } from "express";

/**
 * Fetch all posts
 *
 * @returns Status code 200 and a confirmation message
 */
const getPosts = (req: Request, res: Response, next: Function) => {
  return res.status(200).json({ message: "Fetching posts..." });
};

/**
 * Fetch a post by its ID
 *
 * @returns Status code 200 and a confirmation message
 */
const getPostById = (req: Request, res: Response, next: Function) => {
  return res.status(200).json({ message: "Fetching post..." });
};

/**
 * Update a post's info
 *
 * @returns Status code 200 and a confirmation message
 */
const updatePost = (req: Request, res: Response, next: Function) => {
  return res.status(200).json({ message: "Updating post..." });
};

/**
 * Create a new post
 *
 * @returns Status code 201 and a confirmation message
 */
const createPost = (req: Request, res: Response, next: Function) => {
  return res.status(201).json({ message: "Creating post..." });
};

/**
 * Delete a post
 */
const deletePost = (req: Request, res: Response, next: Function) => {
  return res.status(200).json({ message: "Deleting post..." });
};

export default {
  getPosts,
  getPostById,
  updatePost,
  createPost,
  deletePost,
};
