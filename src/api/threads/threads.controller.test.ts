import { Request, Response } from "express";
import mongoose from "mongoose";

import testHelpers from "../../utils/testHelpers";
import controller from "./threads.controller";

describe("The threads controller", () => {
  const req = {};
  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown;

  testHelpers.controllerTestInit();

  describe("getThreads", () => {
    it("should return 200 and a confirmation message", () => {
      controller.getThreads(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("getThreadById", () => {
    it("should return 200 and a confirmation message", () => {
      controller.getThreadById(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("updateThread", () => {
    it("should return 200 and a confirmation message", () => {
      controller.updateThread(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("createThread", () => {
    it("should return 201 and a thread object", async () => {
      const username = "createThread";
      const email = "createThread@example.com";
      const authorId = await testHelpers.generateUserId(
        username,
        email,
        "password123!",
      );

      const boardCategoryTopic = "createThreadCategory";
      const boardCategoryId = await testHelpers.generateCategoryId(
        boardCategoryTopic,
      );

      const boardTopic = "boardTopic";
      const boardId = await testHelpers.generateBoardId(
        boardTopic,
        "Description",
        boardCategoryId,
      );

      const threadTopic = "Thread creation";
      const req = {
        body: {
          authorId,
          boardId,
          topic: threadTopic,
        },
      } as unknown;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.createThread(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(201);
      expect((mRes.json as any).mock.calls[0][0]).toEqual({
        thread: {
          __v: expect.any(Number),
          _id: expect.any(mongoose.Types.ObjectId),
          id: expect.any(String),
          author: {
            authorId: new mongoose.Types.ObjectId(authorId),
            email,
            username,
          },
          board: {
            boardId: new mongoose.Types.ObjectId(boardId),
            topic: boardTopic,
          },
          dateCreated: expect.any(Date),
          lastPost: null,
          posts: expect.any(Array),
          topic: threadTopic,
        },
      });
    });

    it("should return 404 and an error message if the board does not exist", async () => {
      const username = "createThreadNoBoard";
      const email = "createThreadNoBoard@example.com";
      const authorId = await testHelpers.generateUserId(
        username,
        email,
        "password123!",
      );

      const boardId = "123456789012";

      const threadTopic = "Thread creation";
      const req = {
        body: {
          authorId,
          boardId,
          topic: threadTopic,
        },
      } as unknown;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.createThread(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(404);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });

    it("should return 404 and an error message if the author does not exist", async () => {
      const authorId = "123456789012";

      const boardCategoryTopic = "createThreadCategoryNoAuthor";
      const boardCategoryId = await testHelpers.generateCategoryId(
        boardCategoryTopic,
      );

      const boardTopic = "boardTopicNoAuthor";
      const boardId = await testHelpers.generateBoardId(
        boardTopic,
        "Description",
        boardCategoryId,
      );

      const threadTopic = "Thread creation";
      const req = {
        body: {
          authorId,
          boardId,
          topic: threadTopic,
        },
      } as unknown;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.createThread(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(404);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("deleteThread", () => {
    it("should return 200 and a confirmation message", () => {
      controller.deleteThread(
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
