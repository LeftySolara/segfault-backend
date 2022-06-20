import mongoose from "mongoose";
import PostModel from "../models/post";
import ThreadModel from "../models/thread";
import UserModel from "../models/user";
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
  let user;
  try {
    user = await UserModel.findById(id);
  } catch (err: unknown) {
    throw new HttpError("Error fetching posts", 500);
  }

  if (!user) {
    throw new HttpError("User not found", 404);
  }

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
  let thread;
  try {
    thread = await ThreadModel.findById(id);
  } catch (err: unknown) {
    throw new HttpError("Error fetching thread", 500);
  }

  if (!thread) {
    throw new HttpError("Thread not found", 404);
  }

  let posts;
  try {
    posts = await PostModel.find({ "thread.threadId": id });
  } catch (err: unknown) {
    throw new HttpError("Unable to fetch posts", 500);
  }

  return posts.map((post) => post.toObject({ getters: true }));
};

/**
 * Create a new post in a thread
 *
 * @param {string} authorId - The id of the creator of the post
 * @param {string} threadId - The thread the post belongs to
 * @param {string} content - The text content of the post
 *
 * @throws after a database error
 * @throws if the author does not exist
 * @throws if the thread does not exist
 *
 * @returns An object containing post information
 */
const create = async (authorId: string, threadId: string, content: string) => {
  // Check that the thread exists
  let thread;
  try {
    thread = await ThreadModel.findById(threadId);
  } catch (err: unknown) {
    throw new HttpError("Error creating post", 500);
  }
  if (!thread) {
    throw new HttpError("Cannot find thread", 404);
  }

  // Check that the author exists
  let author;
  try {
    author = await UserModel.findById(authorId);
  } catch (err: unknown) {
    throw new HttpError("Error creating post", 500);
  }
  if (!author) {
    throw new HttpError("Cannot find user", 404);
  }

  // Create the post
  const post = new PostModel({
    author: {
      authorId: author._id,
      username: author.username,
      email: author.email,
    },
    thread: {
      threadId: thread._id,
      topic: thread.topic,
    },
    dateCreated: Date.now(),
    content,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await post.save({ session: sess });

    author.posts.push(post._id);
    await author.save({ session: sess, validateModifiedOnly: true });

    thread.posts.push(post._id);
    await thread.save({ session: sess, validateModifiedOnly: true });

    sess.commitTransaction();
  } catch (err: unknown) {
    throw new HttpError("Error saving thread", 500);
  }

  return post.toObject({ getters: true });
};

/**
 * Update a post's content
 *
 * @param {string} id - The id of the post to update
 * @param {string} content - The new content of the post
 *
 * @throws after a database error
 * @throws if the post cannot be found
 *
 * @returns An object containing updated post information
 */
const update = async (id: string, content: string) => {
  let post;

  try {
    post = await PostModel.findById(id);
  } catch (err: unknown) {
    throw new HttpError("Error fetching post", 500);
  }
  if (!post) {
    throw new HttpError("Cannot find post", 404);
  }

  try {
    post.content = content;
    await post.save();
  } catch (err: unknown) {
    throw new HttpError("Error saving post", 500);
  }

  return post.toObject({ getters: true });
};

/**
 * Delete a post from a thread
 *
 * @param {string} id - The id of the post to delete
 *
 * @throws after a database error
 * @throws if the post cannot be found
 * @throws if the thread cannot be found
 * @throws if the user cannot be found
 *
 * @returns An object containing information about the deleted post
 */
const del = async (id: string) => {
  let post;

  try {
    post = await PostModel.findById(id);
  } catch (err: unknown) {
    throw new HttpError("Error deleting post", 500);
  }
  if (!post) {
    throw new HttpError("Post not found", 404);
  }

  // We could have just used .populate() earlier to get the thread and author
  // and pull from them that way. Unfortunately, we've yet to figure out
  // how to get TypeScript to recognize the populated fields such as
  // thread.posts or author.posts. So, we're doing some extra queries
  // and getting the data the long way.
  let thread;
  try {
    thread = await ThreadModel.findById(post.thread.threadId);
  } catch (err: unknown) {
    throw new HttpError("Error deleting post", 500);
  }
  if (!thread) {
    throw new HttpError("Thread not found", 404);
  }

  let author;
  try {
    author = await UserModel.findById(post.author.authorId);
  } catch (err: unknown) {
    throw new HttpError("Error deleting post", 500);
  }
  if (!author) {
    throw new HttpError("User not found", 404);
  }

  const postObj = post.toObject({ getters: true });
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    // Remove the post from its thread
    thread.posts.pull(post);
    await thread.save({ session: sess, validateModifiedOnly: true });

    // Remove the post from the user
    author.posts.pull(post);
    author.save({ session: sess, validateModifiedOnly: true });

    // Delete the post
    await PostModel.findByIdAndDelete(id);

    sess.commitTransaction();
  } catch (err) {
    throw new HttpError("Error deleting post", 500);
  }

  return postObj;
};

export default { getAll, getById, getByUser, getByThread, create, update, del };
