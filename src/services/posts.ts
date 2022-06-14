import PostModel from "../models/post";
import HttpError from "../utils/httpError";

/**
 * Fetch all posts in the database
 *
 * @throws after a database error
 *
 * @returns An array of Post objects
 */
const getAll = async () => {
  let posts;

  try {
    posts = await PostModel.find({});
  } catch (err: unknown) {
    throw new HttpError("Unable to fetch posts", 500);
  }

  return posts.map((post) => post.toObject({ getters: true }));
};

/**
 * Fetch a post by its id
 *
 * @throws after a database error
 * @throws if the post cannot be found
 *
 * @param {string} id - The id of the post to fetch
 */
const getById = async (id: string) => {
  let post;

  try {
    post = await PostModel.findById(id);
  } catch (err: unknown) {
    throw new HttpError("Unable to fetch post", 500);
  }

  if (!post) {
    throw new HttpError("Could not find post", 404);
  }

  return post.toObject({ getters: true });
};

/**
 * Fetch all posts created by a specific user
 *
 * @throws after a database error
 * @throws if the user cannot be found
 *
 * @param {string} id - The id of the user whose posts to fetch
 */
const getByUser = async (id: string) => {
  let posts;

  try {
    posts = await PostModel.find({ "author.authorId": id });
  } catch (err: unknown) {
    throw new HttpError("Unable to fetch posts", 500);
  }

  return posts.map((post) => post.toObject({ getters: true }));
};

/**
 * Fetch all posts from a specific thread
 *
 * @throws after a database error
 * @throws if the thread cannot be found
 *
 * @param {string} id - The id of the thread to fetch posts from
 */
const getByThread = async (id: string) => {
  let posts;

  try {
    posts = await PostModel.find({ "thread.threadId": id });
  } catch (err: unknown) {
    throw new HttpError("Unable to fetch posts", 500);
  }

  return posts.map((post) => post.toObject({ getters: true }));
};

export default { getAll, getById, getByUser, getByThread };
