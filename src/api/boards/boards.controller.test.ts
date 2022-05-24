import { Request, Response } from "express";
import testHelpers from "../../utils/testHelpers";
import controller from "./boards.controller";

describe("The boards controller", () => {
  const req = {};
  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown;

  const boardObject = expect.objectContaining({
    __v: expect.any(Number),
    _id: expect.any(String),
    topic: expect.any(String),
    description: expect.any(String),
    threads: expect.any(Array),
    category: expect.objectContaining({
      id: expect.any(String),
      topic: expect.any(String),
    }),
  });

  testHelpers.controllerTestInit();

  describe("getBoards", () => {
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
    it("should return 201 and a confirmation message", () => {
      controller.createBoard(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(201);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("deleteBoard", () => {
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
