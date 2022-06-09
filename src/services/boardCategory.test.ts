import mongoose from "mongoose";
import BoardCategoryService from "./boardCategory";
import testHelpers from "../utils/testHelpers";

describe("The BoardCategory service", () => {
  testHelpers.serviceTestInit();

  describe("getAll", () => {
    it("should return an empty array if there are no board categories", async () => {
      const categories = await BoardCategoryService.getAll();
      expect(categories).toEqual([]);
    });

    it("should return an array of BoardCategory objects", async () => {
      const category = await testHelpers.generateBoardCategory();
      const categories = await BoardCategoryService.getAll();

      expect(categories).toEqual([
        {
          __v: category.__v,
          _id: category._id,
          id: category.id,
          boards: category.boards,
          sortOrder: category.sortOrder,
          topic: category.topic,
        },
      ]);
    });
  });

  describe("getById", () => {
    it("should return a BoardCategory object", async () => {
      const category = await testHelpers.generateBoardCategory();
      const fetchedCategory = await BoardCategoryService.getById(category.id);

      expect(fetchedCategory).toEqual({
        __v: category.__v,
        _id: category._id,
        id: category.id,
        boards: category.boards,
        sortOrder: category.sortOrder,
        topic: category.topic,
      });
    });

    it("should throw an error if the board category is not found", async () => {
      expect(async () =>
        BoardCategoryService.getById("123456789012"),
      ).rejects.toThrow();
    });
  });

  describe("update", () => {
    const newTopic = "Updated Topic";
    const newSortOrder = 2;

    it("should return updated board category information", async () => {
      const category = await testHelpers.generateBoardCategory();

      const updatedCategory = await BoardCategoryService.update(
        category.id,
        newTopic,
        newSortOrder,
      );

      expect(updatedCategory).toEqual({
        __v: category.__v,
        _id: category._id,
        id: category.id,
        boards: category.boards,
        topic: newTopic,
        sortOrder: newSortOrder,
      });
    });

    it("should update the board category's information in the database", async () => {
      const category = await testHelpers.generateBoardCategory();
      await BoardCategoryService.update(category.id, newTopic, newSortOrder);

      const updatedCategory = await BoardCategoryService.getById(category.id);
      expect(updatedCategory).toEqual({
        __v: category.__v,
        _id: category._id,
        id: category.id,
        boards: category.boards,
        topic: newTopic,
        sortOrder: newSortOrder,
      });
    });

    it("should throw an error if the board category cannot be found", async () => {
      expect(
        async () =>
          await BoardCategoryService.update("123456789012", "Should Fail", 0),
      ).rejects.toThrow();
    });
  });

  describe("create", () => {
    it("should return a BoardCategory object", async () => {
      const topic = "Create test";
      const sortOrder = 1;
      const category = await BoardCategoryService.create(topic, sortOrder);

      expect(category).toEqual({
        __v: 0,
        _id: expect.any(mongoose.Types.ObjectId),
        id: category._id.toString(),
        boards: [],
        topic,
        sortOrder,
      });
    });

    it("should create a new board category in the database", async () => {
      const topic = "Create test";
      const sortOrder = 1;
      const category = await BoardCategoryService.create(topic, sortOrder);
      const fetchedCategory = await BoardCategoryService.getById(category.id);

      expect(fetchedCategory).toEqual({
        __v: category.__v,
        _id: category._id,
        id: category.id,
        boards: category.boards,
        topic: category.topic,
        sortOrder: category.sortOrder,
      });
    });

    it("should throw an error if the sort order is less than zero", async () => {
      expect(async () => {
        return await BoardCategoryService.create("Should fail", -1);
      }).rejects.toThrow();
    });

    it("should throw an error if the topic is an empty string", async () => {
      expect(async () => {
        return await BoardCategoryService.create("", 1);
      }).rejects.toThrow();
    });
  });

  describe("del", () => {
    it("should return information about the deleted category", async () => {
      const category = await testHelpers.generateBoardCategory();
      const deletedCategory = await BoardCategoryService.del(category.id);

      expect(deletedCategory).toEqual({
        __v: category.__v,
        _id: category._id,
        id: category.id,
        boards: category.boards,
        topic: category.topic,
        sortOrder: category.sortOrder,
      });
    });

    it("should remove the requested category from the database", async () => {
      const category = await testHelpers.generateBoardCategory();
      await BoardCategoryService.del(category.id);

      expect(
        async () => await BoardCategoryService.getById(category.id),
      ).rejects.toThrow();
    });

    it("should throw an error if the category cannot be found", async () => {
      expect(
        async () => await BoardCategoryService.del("123456789012"),
      ).rejects.toThrow();
    });
  });
});
