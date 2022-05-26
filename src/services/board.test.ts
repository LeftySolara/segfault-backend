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

  describe("update", () => {
    it("should return an object containing updated board information", async () => {
      const categoryId = await testHelpers.generateCategoryId(
        "UPDATE test category",
      );
      const boardId = await testHelpers.generateBoardId(
        "Original Topic",
        "Original Description",
        categoryId,
      );

      const topic = "Updated topic";
      const description = "Updated description";

      const board = await BoardService.update(
        boardId,
        topic,
        description,
        categoryId,
      );

      const updatedBoard = {
        __v: 0,
        _id: new mongoose.Types.ObjectId(boardId),
        id: boardId,
        topic,
        description,
        threads: [],
        category: {
          id: new mongoose.Types.ObjectId(categoryId),
          topic: "UPDATE test category",
        },
      };

      expect(board).toEqual(updatedBoard);
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
