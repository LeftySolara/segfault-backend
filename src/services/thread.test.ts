import mongoose from "mongoose";

import ThreadService from "./thread";
import testHelpers from "../utils/testHelpers";

describe("The Thread service", () => {
  testHelpers.serviceTestInit();

  describe("getAll", () => {
    it("should return a list of thread objects", async () => {
      const username = "getAll";
      const email = "getAll@example.com";
      const authorId = await testHelpers.generateUserId(
        username,
        email,
        "password123!",
      );

      const boardCategoryId = await testHelpers.generateCategoryId("getAll");

      const topic = "getAll Test";
      const boardId = await testHelpers.generateBoardId(
        topic,
        "Get all threads",
        boardCategoryId,
      );

      await ThreadService.create(authorId, boardId, topic);

      const threads = await ThreadService.getAll();

      expect(threads).toEqual([
        {
          __v: expect.any(Number),
          _id: expect.any(mongoose.Types.ObjectId),
          author: {
            authorId: new mongoose.Types.ObjectId(authorId),
            username,
            email,
          },
          board: {
            boardId: new mongoose.Types.ObjectId(boardId),
            topic,
          },
          dateCreated: expect.any(Date),
          id: expect.any(String),
          lastPost: null,
          posts: expect.any(Array),
          topic,
        },
      ]);
    });
  });

  describe("getById", () => {
    // Create a thread to fetch
    it("should return a thread object", async () => {
      const username = "getThread";
      const email = "getThread@example.com";
      const authorId = await testHelpers.generateUserId(
        username,
        email,
        "password123!",
      );

      const boardCategoryId = await testHelpers.generateCategoryId("getThread");

      const boardTopic = "Thread fetch test";
      const boardId = await testHelpers.generateBoardId(
        boardTopic,
        "A test of thread fetching",
        boardCategoryId,
      );

      const threadTopic = "Testing getById";
      const thread: any = await ThreadService.create(
        authorId,
        boardId,
        threadTopic,
      );

      const fetchedThread = await ThreadService.getById(thread.id);
      expect(fetchedThread).toEqual({
        __v: expect.any(Number),
        _id: thread._id,
        author: {
          authorId: new mongoose.Types.ObjectId(authorId),
          email,
          username,
        },
        board: {
          boardId: new mongoose.Types.ObjectId(boardId),
          topic: boardTopic,
        },
        id: thread.id,
        dateCreated: thread.dateCreated,
        lastPost: null,
        posts: expect.any(Array),
        topic: threadTopic,
      });
    });

    it("should throw an error if the thread cannot be found", () => {
      expect(async () =>
        ThreadService.getById("123456789012"),
      ).rejects.toThrow();
    });
  });

  describe("getByUser", () => {
    it("should return an array of thread objects", () => {});

    it("should return an empty array if the user has no threads", () => {});

    it("should throw an error if the user cannot be found", () => {});
  });

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
