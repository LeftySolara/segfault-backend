import { Request, Response } from "express";
import controller from "./users.controller";

describe("The users controller", () => {
  describe("getUsers", () => {
    const req = {};
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown;

    const userObject = expect.objectContaining({
      _id: expect.any(String),
      email: expect.any(String),
      password: expect.any(String),
      posts: expect.any(Array),
      threads: expect.any(Array),
      joinDate: expect.any(String),
    });

    const usersArray = expect.arrayContaining([userObject]);

    it("should return 200 and an array of user objects", () => {
      controller.getUsers(req as Request, mockResponse as Response, jest.fn());
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ users: usersArray });
    });
  });
});
