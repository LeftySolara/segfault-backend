import { Request, Response } from "express";
import mongoose from "mongoose";
import testHelpers from "../../utils/testHelpers";
import controller from "./boards.controller";

describe("The boards controller", () => {
  const req = {};

  const boardObject = {
    __v: expect.any(Number),
    _id: expect.any(mongoose.Types.ObjectId),
    topic: expect.any(String),
    description: expect.any(String),
    threads: expect.any(Array),
    category: {
      id: expect.any(mongoose.Types.ObjectId),
      topic: expect.any(String),
    },
    id: expect.any(String),
  };

  testHelpers.controllerTestInit();

  describe("getBoards", () => {
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown;

    it("should return 200 and an array of board objects", async () => {
      // Create a board to fetch
      const categoryId = await testHelpers.generateCategoryId(
        "getBoards Category",
      );
      const boardId = await testHelpers.generateBoardId(
        "getBoards",
        "A test run",
        categoryId,
      );

      await controller.getBoards(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({
        boards: expect.arrayContaining([boardObject]),
      });
    });
  });

  describe("getBoardById", () => {
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown;

    it("should return 200 and a board object", async () => {
      const categoryId = await testHelpers.generateCategoryId("getBoardById");
      const boardId = await testHelpers.generateBoardId(
        "getBoardById",
        "A controller test",
        categoryId,
      );

      const req = {
        params: {
          id: boardId,
        },
      } as unknown;

      await controller.getBoardById(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ board: boardObject });
    });

    it("should return 404 if the board is not found", async () => {
      const req = {
        params: {
          id: "123456789012",
        },
      } as unknown;

      await controller.getBoardById(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(404);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("updateBoard", () => {
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown;

    it("should return 200 and an updated board object", async () => {
      const categoryId = await testHelpers.generateCategoryId(
        "Original Category",
      );
      const boardId = await testHelpers.generateBoardId(
        "Original topic",
        "Original description",
        categoryId,
      );

      const topic = "New topic";
      const description = "New description";

      const req = {
        params: {
          id: boardId,
        },
        body: {
          topic,
          description,
          categoryId,
        },
      } as unknown;

      await controller.updateBoard(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      const updatedBoard = {
        board: {
          __v: 0,
          id: boardId,
          _id: new mongoose.Types.ObjectId(boardId),
          topic,
          description,
          threads: [],
          category: {
            id: new mongoose.Types.ObjectId(categoryId),
            topic: "Original Category",
          },
        },
      };

      expect(mRes.status).toBeCalledWith(200);
      expect((mRes.json as any).mock.calls[0][0]).toMatchObject(updatedBoard);
    });

    it("should return 404 and an error message if the board is not found", async () => {
      const req = {
        params: {
          id: "123456789012",
        },
        body: {
          topic: "topic",
          description: "description",
          categoryId: "123",
        },
      } as unknown;

      await controller.updateBoard(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(404);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("createBoard", () => {
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown;

    it("should return 201 and the newly-created board object", async () => {
      const categoryId = await testHelpers.generateCategoryId(
        "Test Creation Category",
      );
      const req = {
        body: {
          topic: "createBoard Example",
          description: "Testing board creation",
          categoryId,
        },
      };

      await controller.createBoard(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(201);
      expect((mRes.json as any).mock.calls[0][0]).toMatchObject({
        board: boardObject,
      });
    });
  });

  describe("deleteBoard", () => {
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown;

    it("should return 200 and a board object", async () => {
      const categoryId = await testHelpers.generateCategoryId("deleteBoard");
      const boardId = await testHelpers.generateBoardId(
        "deleteBoard",
        "delete board",
        categoryId,
      );
      const req = {
        params: {
          id: boardId,
        },
      } as unknown;

      await controller.deleteBoard(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ board: boardObject });
    });

    it("should return 404 and an error message if the board is not found", async () => {
      const req = {
        params: {
          id: "123456789012",
        },
      } as unknown;

      await controller.deleteBoard(
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
