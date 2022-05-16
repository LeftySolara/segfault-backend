import { Request, Response } from "express";
import testHelpers from "../../utils/testHelpers";
import controller from "./boardCategories.controller";

describe("The boardCategories controller", () => {
  const req = {};
  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown;

  testHelpers.controllerTestInit();

  describe("getCategories", () => {
    it("should return 200 and a confirmation message", () => {
      controller.getCategories(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("getCategoryById", () => {
    it("should return 200 and a confirmation message", () => {
      controller.getCategoryById(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("updateCategory", () => {
    it("should return 200 and a confirmation message", () => {
      controller.updateCategory(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("createCategory", () => {
    it("should return 201 and a confirmation message", () => {
      controller.createCategory(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(201);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("deleteCategory", () => {
    it("should return 200 and a confirmation message", () => {
      controller.deleteCategory(
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
