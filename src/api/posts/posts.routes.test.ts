import mongoose from "mongoose";
import request from "supertest";
import testHelpers from "../../utils/testHelpers";
import app from "../../app";

describe("Test the routes at /posts", () => {
  const responseMessage = expect.objectContaining({
    message: expect.any(String),
  });

  testHelpers.routeTestInit(app);

  describe("the endpoint /posts", () => {
    describe("for GET requests", () => {
      it("should respond with status code 200 and an empty array when there are no posts", async () => {
        const response: request.Response = await request(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ posts: [] });
      });

      it("should respond with status code 200 and an array of post objects", async () => {
        const post = await testHelpers.generatePost();
        const response: request.Response = await request(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
          posts: [{ ...post, dateCreated: expect.any(String) }],
        });
      });
    });

    describe("for POST requests", () => {
      it("should respond with status code 201 and a post object", async () => {
        const author = await testHelpers.generateUser();
        const thread = await testHelpers.generateThread();
        const content = "Post Content";

        const response: request.Response = await request(app)
          .post("/posts")
          .send({ content, authorId: author.userId, threadId: thread.id });

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
          post: {
            _id: expect.any(String),
            id: expect.any(String),
            __v: expect.any(Number),
            author: {
              authorId: author.userId,
              email: author.email,
              username: author.username,
            },
            thread: {
              threadId: thread.id,
              topic: thread.topic,
            },
            content,
            dateCreated: expect.any(String),
          },
        });
      });

      it("should respond with status code 404 and an error message if the author does not exist", async () => {
        const thread = await testHelpers.generateThread();
        const content = "Post Content";

        const response: request.Response = await request(app)
          .post("/posts")
          .send({
            content,
            authorId: "123456789012",
            threadId: thread.id,
          });

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(responseMessage);
      });

      it("should respond with status code 404 and an error message if the thread does not exist", async () => {
        const author = await testHelpers.generateUser();
        const content = "Post Content";

        const response: request.Response = await request(app)
          .post("/posts")
          .send({
            content,
            authorId: author.userId,
            threadId: "123456789012",
          });

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(responseMessage);
      });
    });
  });

  describe("the endpoint /posts/{id}", () => {
    describe("for GET requests", () => {
      it("should respond with status code 200 and a post object", async () => {
        const post = await testHelpers.generatePost();

        const response: request.Response = await request(app).get(
          `/posts/${post.id}`,
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
          post: { ...post, dateCreated: expect.any(String) },
        });
      });

      it("should respond with status code 404 and an error message if the post cannot be found", async () => {
        const response: request.Response = await request(app).get(
          "/posts/123456789012",
        );
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(responseMessage);
      });
    });

    describe("for PATCH requests", () => {
      it("should respond with status code 200 and an updated post object", async () => {
        const post = await testHelpers.generatePost();
        const content = "Updated Content";

        const response: request.Response = await request(app)
          .patch(`/posts/${post.id}`)
          .send({
            content,
          });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
          post: { ...post, content, dateCreated: expect.any(String) },
        });
      });

      it("should respond with status code 404 if the post cannot be found", async () => {
        const response: request.Response = await request(app)
          .patch("/posts/123456789012")
          .send({
            content: "Updated Content",
          });

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(responseMessage);
      });
    });

    describe("for DELETE requests", () => {
      it("should respond with status code 200 and a post object", async () => {
        const post = await testHelpers.generatePost();

        const response: request.Response = await request(app).delete(
          `/posts/${post.id}`,
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
          post: { ...post, dateCreated: expect.any(String) },
        });
      });

      it("should respond with status code 404 and an error message if the post cannot be found", async () => {
        const response: request.Response = await request(app).delete(
          "/posts/123456789012",
        );

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(responseMessage);
      });
    });
  });
});
