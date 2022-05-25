import request from "supertest";
import testHelpers from "../../utils/testHelpers";
import app from "../../app";

describe("Test the routes at /boards", () => {
  const responseMessage = expect.objectContaining({
    message: expect.any(String),
  });

  const boardObject = expect.objectContaining({
    __v: expect.any(Number),
    _id: expect.any(String),
    topic: expect.any(String),
    description: expect.any(String),
    threads: expect.any(Array),
    category: expect.objectContaining({
      id: expect.any(String),
      topic: expect.any(String),
    }),
  });

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
    it("should respond to GET requests by returning 200 and a confirmation message", async () => {
      const response: request.Response = await request(app).get("/boards/123");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(responseMessage);
    });

    it("should respond to PATCH requests by returning 200 and a confirmation message", async () => {
      const response: request.Response = await request(app).patch(
        "/boards/123",
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(responseMessage);
    });

    it("should respond to DELETE requests by returning 200 and a confirmation message", async () => {
      const response: request.Response = await request(app).delete(
        "/boards/123",
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(responseMessage);
    });
  });
});
