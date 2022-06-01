import { Request, Response } from "express";
import mongoose from "mongoose";
import testHelpers from "../../utils/testHelpers";
import controller from "./users.controller";

describe("The users controller", () => {
  const req = {};
  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown;

  const userObject = {
    _id: expect.any(mongoose.Types.ObjectId),
    id: expect.any(String),
    __v: expect.any(Number),
    username: expect.any(String),
    email: expect.any(String),
    posts: expect.any(Array),
    threads: expect.any(Array),
    joinDate: expect.any(Date),
  };

  testHelpers.controllerTestInit();

  describe("getUsers", () => {
    it("should return 200 and an array of user objects", async () => {
      const createReq = {
        body: {
          username: "getUsers_test",
          email: "getUsers@example.com",
          password: "34fr4g#$#g3g3Hbo",
        },
      } as unknown;

      const createRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.createUser(
        createReq as Request,
        createRes as Response,
        jest.fn(),
      );

      await controller.getUsers(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ users: [userObject] });
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
    it("should return 201 and an object containing user information", async () => {
      const username = "test_user";
      const email = "test@example.com";
      const password = "password123";

      const req = { body: { username, email, password } };

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.createUser(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(201);
      expect(mRes.json).toBeCalledWith(
        expect.objectContaining({
          user: {
            username,
            email,
            userId: expect.any(String),
            token: expect.any(String),
          },
        }),
      );
    });

    it("should return 422 if the user already exists", async () => {
      const username = "test_user";
      const email = "test@example.com";
      const password = "password123";

      const req = { body: { username, email, password } };

      await controller.createUser(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.createUser(
        req as Request,
        mResponse as Response,
        jest.fn(),
      );

      const mRes = mResponse as Response;
      expect(mRes.status).toBeCalledWith(422);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("deleteUser", () => {
    it("should return 200 and a confirmation message", async () => {
      const username = "test_user";
      const email = "test@example.com";
      const password = "password123";

      const req = { body: { username, email, password } };
      await controller.createUser(
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
