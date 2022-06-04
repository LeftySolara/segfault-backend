import request from "supertest";
import mongoose from "mongoose";
import testHelpers from "../../utils/testHelpers";
import app from "../../app";

describe("Test the routes at /threads", () => {
  const responseMessage = expect.objectContaining({
    message: expect.any(String),
  });

  testHelpers.routeTestInit(app);

  describe("the endpoint /threads", () => {
    it("should respond to GET requests by returning 200 and a confirmation message", async () => {
      const response: request.Response = await request(app).get("/threads");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(responseMessage);
    });

    describe("for POST requests", () => {
      it("should respond with 201 and a thread object", async () => {
        const username = "postTest";
        const email = "postTest@example.com";
        const authorId = await testHelpers.generateUserId(
          username,
          email,
          "password123!",
        );

        const boardCategoryTopic = "POSt Test";
        const boardCategoryId = await testHelpers.generateCategoryId(
          boardCategoryTopic,
        );

        const boardTopic = "POST Test";
        const boardId = await testHelpers.generateBoardId(
          boardTopic,
          "Description",
          boardCategoryId,
        );

        const threadTopic = "POST Test";
        const response: request.Response = await request(app)
          .post("/threads")
          .send({
            authorId,
            boardId,
            topic: threadTopic,
          });

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
          thread: {
            __v: expect.any(Number),
            _id: expect.any(String),
            id: expect.any(String),
            author: {
              authorId,
              email,
              username,
            },
            board: {
              boardId,
              topic: boardTopic,
            },
            dateCreated: expect.any(String),
            lastPost: null,
            posts: expect.any(Array),
            topic: threadTopic,
          },
        });
      });
    });
  });

  describe("the endpoint /threads/{id}", () => {
    it("should respond to GET requests by returning 200 and a confirmation message", async () => {
      const response: request.Response = await request(app).get("/threads/123");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(responseMessage);
    });

    it("should respond to PATCH requests by returning 200 and a confirmation message", async () => {
      const response: request.Response = await request(app).patch(
        "/threads/123",
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(responseMessage);
    });

    it("should respond to DELETE requests by returning 200 and a confirmation message", async () => {
      const response: request.Response = await request(app).delete(
        "/threads/123",
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(responseMessage);
    });
  });
});
