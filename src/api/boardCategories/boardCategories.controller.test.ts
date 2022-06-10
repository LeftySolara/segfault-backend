import { Request, Response } from "express";
import mongoose from "mongoose";
import testHelpers from "../../utils/testHelpers";
import controller from "./boardCategories.controller";

describe("The boardCategories controller", () => {
  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown;

  testHelpers.controllerTestInit();

  describe("getCategories", () => {
    it("should return 200 and an array of boardCategory objects", async () => {
      const category = await testHelpers.generateBoardCategory();

      const req = {} as unknown;
      await controller.getCategories(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect((mRes.json as any).mock.calls[0][0]).toMatchObject({
        categories: [
          {
            _id: category._id,
            topic: category.topic,
            boards: category.boards,
            sortOrder: category.sortOrder,
            id: category.id,
            __v: category.__v,
          },
        ],
      });
    });

    it("should return 200 and an empty array if there are no categories", async () => {
      const req = {} as unknown;
      await controller.getCategories(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ categories: [] });
    });
  });

  describe("getCategoryById", () => {
    it("should return 200 and a BoardCategory object", async () => {
      const category = await testHelpers.generateBoardCategory();

      const req = {
        params: {
          id: category.id,
        },
      } as unknown;

      await controller.getCategoryById(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ category });
    });

    it("should return 404 and an error message when unsuccessful", async () => {
      await controller.getCategoryById(
        { params: { id: "123456789012" } } as unknown as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(404);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("updateCategory", () => {
    it("should return 404 and an error message if the category does not exist", async () => {
      await controller.updateCategory(
        {
          params: { id: "123" },
          body: { topic: "Hello world", sortOrder: 4 },
        } as unknown as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(404);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("createCategory", () => {
    it("should return 201 and a BoardCategory object when inputs are valid", async () => {
      const topic = "createCategory";
      const sortOrder = 1;

      const req = {
        body: {
          topic,
          sortOrder,
        },
      } as unknown;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.createCategory(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(201);
      expect(mRes.json).toBeCalledWith({
        category: {
          __v: 0,
          _id: expect.any(mongoose.Types.ObjectId),
          boards: [],
          id: expect.any(String),
          sortOrder,
          topic,
        },
      });
    });

    it("should return 422 and an error message when the category already exists", async () => {
      const category = await testHelpers.generateBoardCategory();

      const req = {
        body: {
          topic: category.topic,
          sortOrder: category.sortOrder,
        },
      } as unknown;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.createCategory(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(422);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("deleteCategory", () => {
    it("should return 404 and an error message if the category does not exist", async () => {
      await controller.deleteCategory(
        { params: { id: "123" } } as unknown as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(404);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });
});
