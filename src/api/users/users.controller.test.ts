import { Request, Response } from "express";
import controller from "./users.controller";

describe("The users controller", () => {
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

  describe("getUsers", () => {
    it("should return 200 and an array of user objects", () => {
      controller.getUsers(req as Request, mockResponse as Response, jest.fn());
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ users: usersArray });
    });
  });

  describe("getUserById", () => {
    it("should return 200 and a user object if the user is found", () => {
      controller.getUserById(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ user: userObject });
    });
  });

  describe("updateUser", () => {
    it("should return 200 and a confirmation message", () => {
      controller.updateUser(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("createUser", () => {
    it("should return 201 and a confirmation message", () => {
      controller.createUser(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(201);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("deleteUser", () => {
    it("should return 200 and a confirmation message", () => {
      controller.createUser(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });
});
