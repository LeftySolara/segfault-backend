import { Request, Response } from "express";

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

export default {
  getUsers,
};
