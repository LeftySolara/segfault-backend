import { Request, Response } from "express";
import mongoose from "mongoose";
import testHelpers from "../../utils/testHelpers";
import controller from "./boards.controller";

describe("The boards controller", () => {
  const req = {};

  testHelpers.controllerTestInit();

  describe("getBoards", () => {
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown;

    it("should return 200 and an array of board objects", async () => {
      const board = await testHelpers.generateBoard();

      await controller.getBoards(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({
        boards: expect.arrayContaining([board]),
      });
    });
  });

  describe("getBoardById", () => {
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown;

    it("should return 200 and a board object", async () => {
      const board = await testHelpers.generateBoard();

      const req = {
        params: {
          id: board.id,
        },
      } as unknown;

      await controller.getBoardById(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ board });
    });

    it("should return 404 and an error message if the board is not found", async () => {
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
      const board = await testHelpers.generateBoard();
      const topic = "New topic";
      const description = "New description";

      const req = {
        params: {
          id: board.id,
        },
        body: {
          topic,
          description,
          categoryId: board.category.id,
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
          __v: board.__v,
          id: board.id,
          _id: new mongoose.Types.ObjectId(board.id),
          topic,
          description,
          threads: board.threads,
          category: {
            categoryId: new mongoose.Types.ObjectId(board.category.id),
            topic: board.category.topic,
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
      const category = await testHelpers.generateBoardCategory();
      const topic = "createBoard";
      const description = "Create a board";

      const req = {
        body: {
          topic,
          description,
          categoryId: category.id,
        },
      };

      await controller.createBoard(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(201);
      expect((mRes.json as any).mock.calls[0][0]).toEqual({
        board: {
          __v: expect.any(Number),
          id: expect.any(String),
          _id: expect.any(mongoose.Types.ObjectId),
          threads: [],
          category: {
            categoryId: new mongoose.Types.ObjectId(category.id),
            topic: category.topic,
          },
          topic,
          description,
        },
      });
    });
  });

  describe("deleteBoard", () => {
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown;

    it("should return 200 and a board object", async () => {
      const board = await testHelpers.generateBoard();

      const req = {
        params: {
          id: board.id,
        },
      } as unknown;

      await controller.deleteBoard(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ board });
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
