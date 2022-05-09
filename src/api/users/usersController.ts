import { Request, Response } from "express";

/**
 * @returns On success, returns an array containing user objects
 */
const getUsers = (req: Request, res: Response, next: Function) => {
  const users = [
    {
      _id: "123",
      username: "LeftySolara",
      email: "julianne@julianneadams.info",
      password: "eosrnf#esrf#$W#esf5%e",
      posts: [],
      threads: [],
      joinDate: Date.now().toString(),
    },
    {
      _id: "456",
      username: "example",
      email: "hello@example.com",
      password: "qwerty",
      posts: [],
      threads: [],
      joinDate: Date.now().toString(),
    },
  ];

  return res.status(200).json({ users });
};

const getUserById = (req: Request, res: Response, next: Function) => {
  const user = {
    _id: "456",
    username: "example",
    email: "hello@example.com",
    password: "qwerty",
    posts: [],
    threads: [],
    joinDate: Date.now().toString(),
  };

  return user ? res.status(200).json({ user }) : res.status(400);
};

/**
 * Update a user's information
 *
 * @returns If successful, returns 200 status and a message indicating completion
 */
const updateUser = (req: Request, res: Response, next: Function) => {
  return res.status(200).json({ message: "Updating user..." });
};

/**
 * Create a new user account
 */
const createUser = (req: Request, res: Response, next: Function) => {
  return res.status(200).json({ message: "Creating user..." });
};

/**
 * Delete a user
 */
const deleteUser = (req: Request, res: Response, next: Function) => {
  return res.status(200).json({ message: "Deleting user..." });
};

export default {
  getUsers,
  getUserById,
  updateUser,
  createUser,
  deleteUser,
};
