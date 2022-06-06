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
    it("should return 200 and an array of thread objects", async () => {
      // Create a thread to fetch
      const username = "getThreads";
      const email = "getThreads@example.com";
      const authorId = await testHelpers.generateUserId(
        username,
        email,
        "password123!",
      );

      const boardCategoryId = await testHelpers.generateCategoryId(
        "getThreads Category",
      );
      const boardTopic = "getThreads Board";
      const boardId = await testHelpers.generateBoardId(
        boardTopic,
        "description",
        boardCategoryId,
      );

      const threadTopic = "getThreads Thread";
      const req = {
        body: {
          authorId,
          boardId,
          topic: threadTopic,
        },
      } as unknown;

      await controller.createThread(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.getThreads(
        req as Request,
        mResponse as Response,
        jest.fn(),
      );

      const mRes = mResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect((mRes.json as any).mock.calls[0][0]).toEqual({
        threads: [
          {
            __v: expect.any(Number),
            _id: expect.any(mongoose.Types.ObjectId),
            author: {
              username,
              email,
              authorId: new mongoose.Types.ObjectId(authorId),
            },
            board: {
              boardId: new mongoose.Types.ObjectId(boardId),
              topic: boardTopic,
            },
            dateCreated: expect.any(Date),
            id: expect.any(String),
            lastPost: null,
            posts: expect.any(Array),
            topic: threadTopic,
          },
        ],
      });
    });
  });

  describe("getThreadById", () => {
    it("should return 200 and a thread object", async () => {
      const username = "getThread";
      const email = "getThread@example.com";
      const authorId = await testHelpers.generateUserId(
        username,
        email,
        "password123!",
      );

      const boardCategoryTopic = "getThreadCategory";
      const boardCategoryId = await testHelpers.generateCategoryId(
        boardCategoryTopic,
      );

      const boardTopic = "boardTopic";
      const boardId = await testHelpers.generateBoardId(
        boardTopic,
        "Description",
        boardCategoryId,
      );

      const threadTopic = "getThreadById Test";
      const threadId = await testHelpers.generateThreadId(
        authorId,
        boardId,
        threadTopic,
      );

      const mResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      const req = {
        params: {
          id: threadId,
        },
      } as unknown;

      await controller.getThreadById(
        req as Request,
        mResponse as Response,
        jest.fn(),
      );

      const mRes = mResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect((mRes.json as any).mock.calls[0][0]).toEqual({
        thread: {
          __v: expect.any(Number),
          _id: new mongoose.Types.ObjectId(threadId),
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
          id: expect.any(String),
          lastPost: null,
          posts: expect.any(Array),
          topic: threadTopic,
        },
      });
    });

    it("should return 404 and an error message if the thread cannot be found", async () => {
      const req = {
        params: {
          id: "123456789012",
        },
      } as unknown;

      const mResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.getThreadById(
        req as Request,
        mResponse as Response,
        jest.fn(),
      );

      const mRes = mResponse as Response;
      expect(mRes.status).toBeCalledWith(404);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("getThreadsByUser", () => {
    it("should return 200 an array of thread objects", async () => {
      const thread = await testHelpers.generateThread();

      const req = {
        params: {
          id: thread.author.authorId,
        },
      } as unknown;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.getThreadsByUser(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ threads: [thread] });
    });

    it("should return 200 and an empty array if the user has no threads", async () => {
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

      await controller.getThreadsByUser(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ threads: [] });
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

      await controller.getThreadsByUser(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(404);
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
