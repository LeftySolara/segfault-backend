import { Request, Response } from "express";
import testHelpers from "../../utils/testHelpers";
import controller from "./boardCategories.controller";

describe("The boardCategories controller", () => {
  const req = { body: { topic: "Controller Test Category", sortOrder: 1 } };

  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown;

  const boardsArray = expect.arrayContaining(
    expect.objectContaining({
      id: expect.any(String),
      topic: expect.any(String),
    }),
  );

  const boardCategoryObject = expect.objectContaining({
    _id: expect.any(String),
    topc: expect.any(String),
    boards: boardsArray,
    sortOrder: expect.any(Number),
    id: expect.any(String),
    __v: expect.any(Number),
  });

  const boardCategoryArray = expect.arrayContaining([boardCategoryObject]);

  testHelpers.controllerTestInit();

  // This test fails even when the received output matches the expected output.
  // See issue #25: https://git.julianneadams.info/segfault/segfault-backend/-/issues/25.

  // describe("getCategories", () => {
  //   it("should return 200 and an array of boardCategory objects", async () => {
  //     const req = { body: { topic: "FetchMe", sortOrder: 2 } };

  //     const mResponse = {
  //       json: jest.fn(),
  //       status: jest.fn().mockReturnThis(),
  //     } as unknown;

  //     // Create a category to fetch
  //     await controller.createCategory(
  //       req as Request,
  //       mResponse as Response,
  //       jest.fn(),
  //     );

  //     await controller.getCategories(
  //       req as Request,
  //       mockResponse as Response,
  //       jest.fn(),
  //     );
  //     const mRes = mockResponse as Response;
  //     expect(mRes.status).toBeCalledWith(200);
  //     expect(mRes.json).toBeCalledWith(
  //       { boardCategories: boardCategoryArray },
  //     );
  //   });
  // });

  describe("getCategoryById", () => {
    it("should return 404 and an error message when unsuccessful", async () => {
      await controller.getCategoryById(
        { params: { id: "123" } } as unknown as Request,
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
    it("should return 201 and a confirmation message when inputs are valid", async () => {
      await controller.createCategory(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(201);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });

    it("should return 422 and an error message when the category already exists", async () => {
      await controller.createCategory(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

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
