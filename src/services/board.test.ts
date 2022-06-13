import mongoose, { mongo } from "mongoose";
import testHelpers from "../utils/testHelpers";
import BoardService from "./board";

describe("The Board service", () => {
  testHelpers.serviceTestInit();

  describe("getAll", () => {
    it("should return an array of board objects", async () => {
      const board = await testHelpers.generateBoard();
      const boards = await BoardService.getAll();
      expect(boards).toEqual([board]);
    });
  });

  describe("update", () => {
    it("should return an object containing updated board information", async () => {
      const board = await testHelpers.generateBoard();
      const topic = "Updated topic";
      const description = "Updated description";

      const updatedBoard = await BoardService.update(
        board.id,
        topic,
        description,
        board.category.categoryId,
      );

      expect(updatedBoard).toEqual({
        __v: 0,
        _id: new mongoose.Types.ObjectId(board.id),
        id: board.id,
        topic,
        description,
        threads: [],
        category: {
          categoryId: new mongoose.Types.ObjectId(board.category.categoryId),
          topic: board.category.topic,
        },
      });
    });
  });

  describe("create", () => {
    it("should return an object containing board information", async () => {
      const category = await testHelpers.generateBoardCategory();
      const topic = "Example board";
      const description = "This is a creation example";

      const board = await BoardService.create(topic, description, category.id);

      expect(board).toEqual({
        __v: expect.any(Number),
        _id: expect.any(mongoose.Types.ObjectId),
        id: expect.any(String),
        description,
        topic,
        threads: [],
        category: {
          categoryId: category._id,
          topic: category.topic,
        },
      });
    });
  });

  describe("del", () => {
    it("should return an object containing information about the deleted board", async () => {
      const board = await testHelpers.generateBoard();
      const deletedBoard = await BoardService.del(board.id);

      expect(deletedBoard).toEqual(board);
    });

    it("should throw an error when the board cannot be found", async () => {
      expect(async () => {
        await BoardService.del("123456789012");
      }).rejects.toThrow();
    });
  });
});
