import { Request, Response } from "express";
import testHelpers from "../../utils/testHelpers";
import controller from "./posts.controller";

describe("The posts controller", () => {
  const req = {};
  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown;

  testHelpers.controllerTestInit();

  describe("getPosts", () => {
    it("should return 200 and an array of post objects", async () => {
      const post = await testHelpers.generatePost();

      await controller.getPosts(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect((mRes.json as any).mock.calls[0][0]).toEqual({ posts: [post] });
    });
  });

  describe("getPostById", () => {
    it("should return 200 and a post object", async () => {
      const post = await testHelpers.generatePost();

      const req = {
        params: {
          id: post.id,
        },
      } as unknown;

      await controller.getPostById(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ post });
    });

    it("should return 404 and an error message if the post does not exist", async () => {
      const req = {
        params: {
          id: "123456789012",
        },
      } as unknown;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.getPostById(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(404);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("getPostByUser", () => {
    it("should return 200 and an array of post objects", async () => {
      const post = await testHelpers.generatePost();

      const req = {
        params: {
          id: post.author.authorId,
        },
      } as unknown;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.getPostsByUser(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ posts: [post] });
    });

    it("should return 404 and an error message if the user is not found", async () => {
      const req = {
        params: {
          id: "123456789012",
        },
      } as unknown;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.getPostsByUser(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(404);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("updatePost", () => {
    it("should return 200 and a confirmation message", () => {
      controller.updatePost(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("createPost", () => {
    it("should return 201 and a confirmation message", () => {
      controller.createPost(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(201);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });

  describe("deletePost", () => {
    it("should return 200 and a confirmation message", () => {
      controller.deletePost(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );
      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });
});
