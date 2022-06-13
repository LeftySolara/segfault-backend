import { Request, Response } from "express";
import mongoose from "mongoose";

import testHelpers from "../../utils/testHelpers";
import controller from "./threads.controller";

describe("The threads controller", () => {
  const req = {};

  testHelpers.controllerTestInit();

  describe("getThreads", () => {
    it("should return 200 and an array of thread objects", async () => {
      const thread = await testHelpers.generateThread();

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
        threads: [thread],
      });
    });
  });

  describe("getThreadById", () => {
    it("should return 200 and a thread object", async () => {
      const thread = await testHelpers.generateThread();

      const mResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      const req = {
        params: {
          id: thread.id,
        },
      } as unknown;

      await controller.getThreadById(
        req as Request,
        mResponse as Response,
        jest.fn(),
      );

      const mRes = mResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect((mRes.json as any).mock.calls[0][0]).toEqual({ thread });
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
    it("should return 200 and an updated thread object", async () => {
      const thread = await testHelpers.generateThread();
      const newTopic = "New Topic";

      const req = {
        params: {
          id: thread.id,
        },
        body: {
          topic: newTopic,
        },
      } as unknown;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.updateThread(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({
        thread: {
          ...thread,
          topic: newTopic,
        },
      });
    });

    it("should return 404 and an error message if the thread cannot be found", async () => {
      const req = {
        params: {
          id: "123456789012",
        },
        body: {
          topic: "New Topic",
        },
      } as unknown;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.updateThread(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(404);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("createThread", () => {
    it("should return 201 and a thread object", async () => {
      const board = await testHelpers.generateBoard();
      const user = await testHelpers.generateUser();
      const threadTopic = "Thread topic";

      const req = {
        body: {
          authorId: user.userId,
          boardId: board.id,
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
            authorId: new mongoose.Types.ObjectId(user.userId),
            email: user.email,
            username: user.username,
          },
          board: {
            boardId: new mongoose.Types.ObjectId(board.id),
            topic: board.topic,
          },
          dateCreated: expect.any(Date),
          lastPost: null,
          posts: expect.any(Array),
          topic: threadTopic,
        },
      });
    });

    it("should return 404 and an error message if the board does not exist", async () => {
      const user = await testHelpers.generateUser();
      const boardId = "123456789012";
      const threadTopic = "Thread creation";

      const req = {
        body: {
          authorId: user.authorId,
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
      const board = await testHelpers.generateBoard();
      const authorId = "123456789012";
      const threadTopic = "Thread creation";

      const req = {
        body: {
          authorId,
          boardId: board.id,
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
    it("should return 200 and a thread object", async () => {
      const thread = await testHelpers.generateThread();

      const req = {
        params: {
          id: thread.id,
        },
      } as unknown;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.deleteThread(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ thread });
    });

    it("should return 404 if the thread is not found", async () => {
      const req = {
        params: {
          id: "123456789012",
        },
      } as unknown;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.deleteThread(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(404);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });
});
