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
          boards: category.boards,
          id: category._id.toString(),
          sortOrder: category.sortOrder,
          topic: category.topic,
        },
      ]);
    });
  });

  describe("getById", () => {
    it("should return a BoardCategory object", async () => {
      const category = await testHelpers.generateBoardCategory();
      const fetchedCategory = await BoardCategoryService.getById(
        category._id.toString(),
      );

      expect(fetchedCategory).toEqual({
        __v: category.__v,
        _id: category._id,
        boards: category.boards,
        id: category._id.toString(),
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
    it("should return updated board category information", async () => {});
    it("should update the board category's information in the database", async () => {});
    it("should throw an error if the board category cannot be found", async () => {});
  });

  describe("create", () => {
    it("should return a BoardCategory object", async () => {});
    it("should create a new board category in the database", async () => {});
    it("should throw an error if the category already exists", async () => {});
    it("should throw an error if the sort order is less than zero", async () => {});
    it("should throw an error if the topic is an empty string", async () => {});
  });

  describe("del", () => {
    it("should return information about the deleted category", async () => {});
    it("should remove the requested category from the database", async () => {});
    it("should throw an error if the category cannot be found", async () => {});
  });
});
