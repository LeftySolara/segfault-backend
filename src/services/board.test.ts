import mongoose from "mongoose";
import testHelpers from "../utils/testHelpers";
import BoardService from "./board";

describe("The Board service", () => {
  const responseMessage = expect.objectContaining({
    message: expect.any(String),
  });

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

  testHelpers.serviceTestInit();

  describe("getAll", () => {
    // TODO: create a board to test fetching with
    it("should return an array of board objects", async () => {
      const boards = await BoardService.getAll();
      expect(boards).toEqual([]);
    });
  });

  describe("create", () => {
    it("should return an object containing board information", async () => {
      const categoryId = await testHelpers.generateCategoryId(
        "Service creation test",
      );

      const board = await BoardService.create(
        "Example board",
        "This is a creation example",
        categoryId,
      );
      expect(board).toEqual(boardObject);
    });
  });
});
