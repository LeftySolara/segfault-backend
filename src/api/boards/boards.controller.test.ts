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
      await controller.getBoards(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({
        boards: [],
      });
    });
  });

  describe("getBoardById", () => {
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown;

    it("should return 200 and a confirmation message", () => {
      controller.getBoardById(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("updateBoard", () => {
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown;

    it("should return 200 and a confirmation message", () => {
      controller.updateBoard(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
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

    it("should return 200 and a confirmation message", () => {
      controller.deleteBoard(
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
