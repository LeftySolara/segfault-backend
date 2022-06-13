import request from "supertest";
import testHelpers from "../../utils/testHelpers";
import app from "../../app";

describe("Test the routes at /boards", () => {
  const responseMessage = expect.objectContaining({
    message: expect.any(String),
  });

  testHelpers.routeTestInit(app);

  describe("the endpoint /boards", () => {
    describe("for GET requests", () => {
      it("should return 200 and an array of board objects", async () => {
        const board = await testHelpers.generateBoard();

        const response: request.Response = await request(app).get("/boards");
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ boards: [board] });
      });
    });

    describe("for POST requests", () => {
      it("should return 201 and the newly-created board object", async () => {
        const category = await testHelpers.generateBoardCategory();
        const topic = "POST test";
        const description = "POST test case";

        const payload = {
          topic,
          description,
          categoryId: category.id,
        };

        const response: request.Response = await request(app)
          .post("/boards")
          .send(payload);
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
          board: {
            __v: expect.any(Number),
            _id: expect.any(String),
            id: expect.any(String),
            threads: [],
            topic,
            description,
            category: {
              categoryId: category.id,
              topic: category.topic,
            },
          },
        });
      });
    });
  });

  describe("the endpoint /boards/{id}", () => {
    describe("for GET requests", () => {
      it("should return 200 and a board object", async () => {
        const board = await testHelpers.generateBoard();

        const response: request.Response = await request(app).get(
          `/boards/${board.id}`,
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ board });
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
        const board = await testHelpers.generateBoard();

        const response: request.Response = await request(app)
          .patch(`/boards/${board.id}`)
          .send({ topic, description, categoryId: board.category.categoryId });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
          board: { ...board, topic, description },
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
        const board = await testHelpers.generateBoard();

        const response: request.Response = await request(app).delete(
          `/boards/${board.id}`,
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ board });
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
