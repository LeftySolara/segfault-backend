import { Request, Response } from "express";
import mongoose from "mongoose";
import testHelpers from "../../utils/testHelpers";
import controller from "./users.controller";

describe("The users controller", () => {
  const req = {};

  testHelpers.controllerTestInit();

  describe("getUsers", () => {
    it("should return 200 and an array of user objects", async () => {
      const user = await testHelpers.generateUser();

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.getUsers(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect((mRes.json as any).mock.calls[0][0]).toEqual({
        users: [
          {
            __v: expect.any(Number),
            _id: new mongoose.Types.ObjectId(user.userId),
            email: user.email,
            id: user.userId,
            joinDate: expect.any(Date),
            posts: [],
            threads: [],
            username: user.username,
          },
        ],
      });
    });
  });

  describe("getUserById", () => {
    it("should return 200 and a user object if the user is found", async () => {
      const user = await testHelpers.generateUser();

      const req = {
        params: {
          id: user.userId,
        },
      } as unknown;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.getUserById(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect((mRes.json as any).mock.calls[0][0]).toMatchObject({
        user: {
          __v: expect.any(Number),
          _id: new mongoose.Types.ObjectId(user.userId),
          id: user.userId,
          username: user.username,
          email: user.email,
          posts: expect.any(Array),
          threads: expect.any(Array),
          joinDate: expect.any(Date),
        },
      });
    });

    it("should return 404 and an error message if the user cannot be found", async () => {
      const req = {
        params: {
          id: "123456789012",
        },
      } as unknown;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.getUserById(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(404);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("updateUser", () => {
    it("should return 200 and an updated user object", async () => {
      const user = await testHelpers.generateUser();
      const username = "new_username";
      const email = "new_email@example.com";
      const password = "new_password123!";

      const req = {
        params: {
          id: user.userId,
        },
        body: {
          username,
          email,
          password,
        },
      } as unknown;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.updateUser(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect((mRes.json as any).mock.calls[0][0]).toMatchObject({
        user: {
          __v: expect.any(Number),
          _id: new mongoose.Types.ObjectId(user.userId),
          id: expect.any(String),
          username,
          email,
          posts: expect.any(Array),
          threads: expect.any(Array),
          joinDate: expect.any(Date),
        },
      });
    });

    it("should return 404 and an error message if the user cannot be found", async () => {
      const userId = "123456789012";
      const req = {
        params: {
          id: userId,
        },
        body: {
          username: "new_username",
          email: "new_email@example.com",
          password: "new_password123!",
        },
      } as unknown;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.updateUser(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(404);
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
      const user = await testHelpers.generateUser();

      const req = {
        body: {
          username: user.username,
          email: user.email,
          password: "new_password",
        },
      } as unknown;

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
});
