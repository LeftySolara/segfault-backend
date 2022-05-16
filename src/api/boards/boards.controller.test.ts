import { Request, Response } from "express";
import testHelpers from "../../utils/testHelpers";
import controller from "./boards.controller";

describe("The boards controller", () => {
  const req = {};
  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown;

  testHelpers.controllerTestInit();

  describe("getBoards", () => {
    it("should return 200 and a confirmation message", () => {
      controller.getBoards(req as Request, mockResponse as Response, jest.fn());
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
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
