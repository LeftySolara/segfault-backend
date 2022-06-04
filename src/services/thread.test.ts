import mongoose from "mongoose";

import ThreadService from "./thread";
import testHelpers from "../utils/testHelpers";

describe("The Thread service", () => {
  testHelpers.serviceTestInit();

  describe("create", () => {
    it("should return an object containing thread information", async () => {
      const username = "createThread";
      const email = "createThread@example.com";
      const authorId = await testHelpers.generateUserId(
        "createThread",
        "createThread@example.com",
        "password123!",
      );

      const boardCategoryId = await testHelpers.generateCategoryId(
        "createThread",
      );

      const topic = "Thread creation test";
      const boardId = await testHelpers.generateBoardId(
        topic,
        "A test of thread creation",
        boardCategoryId,
      );

      const thread = await ThreadService.create(authorId, boardId, topic);

      expect(thread).toEqual({
        __v: expect.any(Number),
        _id: expect.any(mongoose.Types.ObjectId),
        id: expect.any(String),
        author: {
          authorId: new mongoose.Types.ObjectId(authorId),
          email,
          username,
        },
        board: {
          boardId: new mongoose.Types.ObjectId(boardId),
          topic,
        },
        dateCreated: expect.any(Date),
        posts: expect.any(Array),
        lastPost: null,
        topic,
      });
    });

    it("should throw an error if the board does not exist", async () => {
      const username = "boardDoesNotExist";
      const email = "boardDoesNotExist@example.com";
      const authorId = await testHelpers.generateUserId(
        username,
        email,
        "password123!",
      );
      const boardId = "123456789012";

      expect(
        async () =>
          await ThreadService.create(authorId, boardId, "Board does not exist"),
      ).rejects.toThrow();
    });

    it("should throw an error if the author does not exist", async () => {
      const authorId = "123456789012";
      const boardCategoryId = await testHelpers.generateCategoryId(
        "Author does not exist",
      );
      const boardId = await testHelpers.generateBoardId(
        "Author does not exist",
        "No author",
        boardCategoryId,
      );

      expect(
        async () =>
          await ThreadService.create(
            authorId,
            boardId,
            "Author does not exist",
          ),
      ).rejects.toThrow();
    });
  });
});
