import request from "supertest";
import testHelpers from "../../utils/testHelpers";
import app from "../../app";

describe("Test the routes at /boards", () => {
  const responseMessage = expect.objectContaining({
    message: expect.any(String),
  });

  const boardObject = {
    __v: expect.any(Number),
    _id: expect.any(String),
    id: expect.any(String),
    topic: expect.any(String),
    description: expect.any(String),
    threads: expect.any(Array),
    category: {
      categoryId: expect.any(String),
      topic: expect.any(String),
    },
  };

  testHelpers.routeTestInit(app);

  describe("the endpoint /boards", () => {
    describe("for GET requests", () => {
      it("should return 200 and an array of board objects", async () => {
        const response: request.Response = await request(app).get("/boards");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ boards: [] });
      });
    });

    describe("for POST requests", () => {
      it("should return 201 and the newly-created board object", async () => {
        const categoryId = await testHelpers.generateCategoryId(
          "POST Requests Category",
        );
        const payload = {
          topic: "POST Example Board",
          description: "An example board for POST requests",
          categoryId,
        };

        const response: request.Response = await request(app)
          .post("/boards")
          .send(payload);
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({ board: boardObject });
      });
    });
  });

  describe("the endpoint /boards/{id}", () => {
    describe("for GET requests", () => {
      it("should return 200 and a board object", async () => {
        // Create a board to fetch
        const categoryId = await testHelpers.generateCategoryId("GET board");
        const boardId = await testHelpers.generateBoardId(
          "GET /boards/{id}",
          "Testing fetching board",
          categoryId,
        );

        const response: request.Response = await request(app).get(
          `/boards/${boardId}`,
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ board: boardObject });
      });

      it("should respond with 404 if the board is not found", async () => {
        const response: request.Response = await request(app).get(
          "/boards/123456789012",
        );
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(responseMessage);
      });
    });

    describe("for PATCH requests", () => {
      it("should return 200 and an updated board object", async () => {
        const topic = "PATCH Test";
        const description = "A PATCH test";
        const categoryId = await testHelpers.generateCategoryId(
          "PATCH Test Category",
        );
        const boardId = await testHelpers.generateBoardId(
          "Original topic",
          "Original description",
          categoryId,
        );

        const response: request.Response = await request(app)
          .patch(`/boards/${boardId}`)
          .send({ topic, description, categoryId });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
          board: {
            topic,
            description,
            __v: 0,
            _id: boardId,
            id: boardId,
            category: {
              categoryId,
              topic: "PATCH Test Category",
            },
            threads: [],
          },
        });
      });

      it("should return 404 and an error message if the board is not found", async () => {
        const requestBody = {
          topic: "PATCH test",
          description: "A PATCH test request",
          categoryId: "1234",
        };
        const response: request.Response = await request(app)
          .patch("/boards/123456789012")
          .send(requestBody);
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(responseMessage);
      });
    });

    describe("for DELETE requests", () => {
      it("should return 200 and a board object", async () => {
        const categoryId = await testHelpers.generateCategoryId("DELETE test");
        const boardId = await testHelpers.generateBoardId(
          "DELETE Test",
          "Testing DELETE",
          categoryId,
        );

        const response: request.Response = await request(app).delete(
          `/boards/${boardId}`,
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ board: boardObject });
      });

      it("should return 404 and an error message when the board is not found", async () => {
        const response: request.Response = await request(app).delete(
          "/boards/123456789012",
        );

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(responseMessage);
      });
    });
  });
});
