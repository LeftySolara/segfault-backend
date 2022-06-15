import mongoose from "mongoose";
import PostService from "./post";
import testHelpers from "../utils/testHelpers";

describe("The Post service", () => {
  testHelpers.serviceTestInit();

  describe("getAll", () => {
    it("should return a list of post objects", async () => {
      const post = await testHelpers.generatePost();
      const posts = await PostService.getAll();

      expect(posts).toEqual([post]);
    });

    it("should return an empty array if there are no posts", async () => {
      const posts = await PostService.getAll();
      expect(posts).toEqual([]);
    });
  });

  describe("getById", () => {
    it("should return a post object", async () => {
      const post = await testHelpers.generatePost();
      const fetchedPost = await PostService.getById(post.id);

      expect(fetchedPost).toEqual(post);
    });

    it("should throw an error if the post cannot be found", () => {
      expect(
        async () => await PostService.getById("123456789012"),
      ).rejects.toThrow();
    });
  });

  describe("getByUser", () => {
    it("should return a list of post objects", async () => {
      const post = await testHelpers.generatePost();
      const posts = await PostService.getByUser(
        post.author.authorId.toString(),
      );

      expect(posts).toEqual([post]);
    });

    it("should return an empty array if the user has no posts", async () => {
      const user = await testHelpers.generateUser();
      const posts = await PostService.getByUser(user.userId);
      expect(posts).toEqual([]);
    });
  });

  describe("getByThread", () => {
    it("should return a list of post objects", async () => {
      const post = await testHelpers.generatePost();
      const posts = await PostService.getByThread(
        post.thread.threadId.toString(),
      );
      expect(posts).toEqual([post]);
    });

    it("should return an empty array if the thread has no posts", async () => {
      const thread = await testHelpers.generateThread();
      const posts = await PostService.getByThread(thread.id);
      expect(posts).toEqual([]);
    });
  });

  describe("create", () => {
    it("should return an object containing post information", async () => {
      const thread = await testHelpers.generateThread();
      const user = await testHelpers.generateUser();
      const content = "Post content";

      const post = await PostService.create(user.userId, thread.id, content);

      expect(post).toEqual({
        __v: expect.any(Number),
        _id: expect.any(mongoose.Types.ObjectId),
        author: {
          authorId: new mongoose.Types.ObjectId(user.userId),
          email: user.email,
          username: user.username,
        },
        thread: {
          threadId: new mongoose.Types.ObjectId(thread.id),
          topic: thread.topic,
        },
        content,
        dateCreated: expect.any(Date),
        id: expect.any(String),
      });
    });

    it("should throw an error if the thread does not exist", async () => {
      const user = await testHelpers.generateUser();
      const content = "Post content";

      expect(
        async () =>
          await PostService.create(user.userId, "123456789012", content),
      ).rejects.toThrow();
    });

    it("should throw an error if the author does not exist", async () => {
      const thread = await testHelpers.generateThread();
      const content = "Post content";

      expect(
        async () =>
          await PostService.create("123456789012", thread.id, content),
      ).rejects.toThrow();
    });
  });

  describe("update", () => {
    it("should return an updated post object", async () => {
      const post = await testHelpers.generatePost();
      const newContent = "New post content";

      const updatedPost = await PostService.update(post.id, newContent);

      expect(updatedPost).toEqual({
        ...post,
        content: newContent,
      });
    });

    it("should throw an error if the post does not exist", () => {
      expect(
        async () => await PostService.update("123456789012", "Hello World"),
      ).rejects.toThrow();
    });
  });

  describe("del", () => {
    it("should return information about the deleted post", async () => {
      const post = await testHelpers.generatePost();
      const deletedPost = await PostService.del(post.id);

      expect(deletedPost).toEqual(post);
    });

    it("should throw an error if the post does not exist", () => {
      expect(
        async () => await PostService.del("123456789012"),
      ).rejects.toThrow();
    });
  });
});
