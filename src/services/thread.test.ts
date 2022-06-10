import mongoose from "mongoose";

import ThreadService from "./thread";
import testHelpers from "../utils/testHelpers";

describe("The Thread service", () => {
  testHelpers.serviceTestInit();

  describe("getAll", () => {
    it("should return a list of thread objects", async () => {
      const thread = await testHelpers.generateThread();
      const threads = await ThreadService.getAll();

      expect(threads).toEqual([thread]);
    });

    it("should return an empty array if there are no threads", async () => {
      const threads = await ThreadService.getAll();
      expect(threads).toEqual([]);
    });
  });

  describe("getById", () => {
    it("should return a thread object", async () => {
      const thread = await testHelpers.generateThread();
      const fetchedThread = await ThreadService.getById(thread.id);

      expect(fetchedThread).toEqual(thread);
    });

    it("should throw an error if the thread cannot be found", () => {
      expect(async () =>
        ThreadService.getById("123456789012"),
      ).rejects.toThrow();
    });
  });

  describe("getByUser", () => {
    it("should return an array of thread objects", async () => {
      const thread = await testHelpers.generateThread();
      const userThreads = await ThreadService.getByUser(
        thread.author.authorId.toString(),
      );

      expect(userThreads).toEqual([thread]);
    });

    it("should return an empty array if the user has no threads", async () => {
      const user = await testHelpers.generateUser();
      const userThreads = await ThreadService.getByUser(user.userId);
      expect(userThreads).toEqual([]);
    });

    it("should throw an error if the user cannot be found", () => {
      expect(
        async () => await ThreadService.getByUser("123456789012"),
      ).rejects.toThrow();
    });
  });

  describe("update", () => {
    it("should return a thread object with updated information", async () => {
      const thread = await testHelpers.generateThread();

      const newTopic = "New Topic";
      const updatedThread = await ThreadService.update(thread.id, newTopic);

      expect(updatedThread).toEqual({
        __v: thread.__v,
        _id: thread._id,
        author: thread.author,
        board: thread.board,
        dateCreated: thread.dateCreated,
        id: thread.id,
        lastPost: thread.lastPost,
        posts: thread.posts,
        topic: newTopic,
      });
    });

    it("should throw an error if the thread is not found", () => {
      expect(
        async () => await ThreadService.update("123456789012", "New Topic"),
      ).rejects.toThrow();
    });
  });

  describe("create", () => {
    it("should return an object containing thread information", async () => {
      const author = await testHelpers.generateUser();
      const board = await testHelpers.generateBoard();

      const topic = "Thread creation test";
      const thread = await ThreadService.create(author.userId, board.id, topic);

      expect(thread).toEqual({
        __v: expect.any(Number),
        _id: expect.any(mongoose.Types.ObjectId),
        id: expect.any(String),
        author: {
          authorId: new mongoose.Types.ObjectId(author.userId),
          email: author.email,
          username: author.username,
        },
        board: {
          boardId: new mongoose.Types.ObjectId(board.id),
          topic: board.topic,
        },
        dateCreated: expect.any(Date),
        posts: expect.any(Array),
        lastPost: null,
        topic,
      });
    });

    it("should throw an error if the board does not exist", async () => {
      const user = await testHelpers.generateUser();

      expect(
        async () =>
          await ThreadService.create(
            user.userId,
            "123456789012",
            "Board does not exist",
          ),
      ).rejects.toThrow();
    });

    it("should throw an error if the author does not exist", async () => {
      const authorId = "123456789012";
      const board = await testHelpers.generateBoard();

      expect(
        async () =>
          await ThreadService.create(
            authorId,
            board.id,
            "Author does not exist",
          ),
      ).rejects.toThrow();
    });
  });

  describe("del", () => {
    it("should return information about the deleted thread", async () => {
      const thread = await testHelpers.generateThread();
      const deletedThread = await ThreadService.del(thread.id);
      expect(deletedThread).toEqual(thread);
    });

    it("should delete the requested thread from the database", async () => {
      const thread = await testHelpers.generateThread();
      await ThreadService.del(thread.id);

      expect(
        async () => await ThreadService.getById(thread.id),
      ).rejects.toThrow();
    });

    it("should throw an error if the thread is not found", () => {
      expect(
        async () => await ThreadService.del("123456789012"),
      ).rejects.toThrow();
    });
  });
});
