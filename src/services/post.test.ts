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
});
