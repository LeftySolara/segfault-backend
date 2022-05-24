import testHelpers from "../utils/testHelpers";
import BoardService from "./board";

describe("The Board service", () => {
  const responseMessage = expect.objectContaining({
    message: expect.any(String),
  });

  const boardObject = expect.objectContaining({
    __v: expect.any(Number),
    _id: expect.any(String),
    topic: expect.any(String),
    description: expect.any(String),
    threads: expect.any(Array),
    category: expect.objectContaining({
      id: expect.any(String),
      topic: expect.any(String),
    }),
  });

  testHelpers.serviceTestInit();

  describe("getAll", () => {
    // TODO: create a board to test fetching with
    it("should return an array of board objects", async () => {
      const boards = await BoardService.getAll();
      expect(boards).toEqual([]);
    });
  });
});
