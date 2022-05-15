import { Request, Response } from "express";
import controller from "./threads.controller";

describe("The threads controller", () => {
  const req = {};
  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown;

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
    it("should return 201 and a confirmation message", () => {
      controller.createThread(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(201);
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
