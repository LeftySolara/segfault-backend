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
    describe("for GET requests", () => {
      it("should respond with 200 and an array of thread objects", async () => {
        const username = "getTest";
        const email = "getTest@example.com";
        const authorId = await testHelpers.generateUserId(
          username,
          email,
          "password123!",
        );

        const boardCategoryTopic = "GET Test";
        const boardCategoryId = await testHelpers.generateCategoryId(
          boardCategoryTopic,
        );

        const boardTopic = "GET Test";
        const boardId = await testHelpers.generateBoardId(
          boardTopic,
          "Description",
          boardCategoryId,
        );

        const threadTopic = "GET Test";
        await request(app).post("/threads").send({
          authorId,
          boardId,
          topic: threadTopic,
        });

        const response: request.Response = await request(app).get("/threads");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
          threads: [
            {
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
              lastPost: null,
              posts: expect.any(Array),
              topic: threadTopic,
              dateCreated: expect.any(String),
            },
          ],
        });
      });
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
    describe("for GET requests", () => {
      it("should respond with 200 and a thread object", async () => {
        const username = "getThread";
        const email = "getThread@example.com";
        const authorId = await testHelpers.generateUserId(
          username,
          email,
          "password123!",
        );

        const boardCategoryTopic = "getThreadCategory";
        const boardCategoryId = await testHelpers.generateCategoryId(
          boardCategoryTopic,
        );

        const boardTopic = "boardTopic";
        const boardId = await testHelpers.generateBoardId(
          boardTopic,
          "Description",
          boardCategoryId,
        );

        const threadTopic = "getThreadById Test";
        const threadId = await testHelpers.generateThreadId(
          authorId,
          boardId,
          threadTopic,
        );

        const response: request.Response = await request(app).get(
          `/threads/${threadId}`,
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
          thread: {
            __v: expect.any(Number),
            _id: threadId,
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
            id: expect.any(String),
            lastPost: null,
            posts: expect.any(Array),
            topic: threadTopic,
          },
        });
      });

      it("should respond with 404 and an error message if the thread cannot be found", async () => {
        const response: request.Response = await request(app).get(
          "/threads/123456789012",
        );
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(responseMessage);
      });
    });

    describe("for PATCH requests", () => {
      it("should return 200 and an updated thread object", async () => {
        const thread = await testHelpers.generateThread();
        const newTopic = "New Topic";

        const response: request.Response = await request(app)
          .patch(`/threads/${thread.id}`)
          .send({ topic: newTopic });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
          thread: {
            __v: thread.__v,
            _id: thread._id,
            author: thread.author,
            board: thread.board,
            dateCreated: expect.any(String),
            lastPost: thread.lastPost,
            posts: thread.posts,
            topic: newTopic,
            id: thread.id,
          },
        });
      });

      it("should return 404 and an error message if the thread is not found", async () => {
        const response: request.Response = await request(app)
          .patch("/threads/123456789012")
          .send({ topic: "New Topic" });

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(responseMessage);
      });
    });

    it("should respond to DELETE requests by returning 200 and a confirmation message", async () => {
      const response: request.Response = await request(app).delete(
        "/threads/123",
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(responseMessage);
    });
  });

  describe("the endpoint /threads/user/{id}", () => {
    describe("for GET requests", () => {
      it("should respond with 200 and an array of thread objects", async () => {
        const thread = await testHelpers.generateThread();

        const response: request.Response = await request(app).get(
          `/threads/user/${thread.author.authorId.toString()}`,
        );
        thread.dateCreated = expect.any(String);
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ threads: [thread] });
      });

      it("should respond with 200 and an empty array if the user has no threads", async () => {
        const user = await testHelpers.generateUser();

        const response: request.Response = await request(app).get(
          `/threads/user/${user.userId}`,
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ threads: [] });
      });

      it("should return 404 and an error message if the user is not found", async () => {
        const response: request.Response = await request(app).get(
          "/threads/user/123456789012",
        );

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(responseMessage);
      });
    });
  });
});
