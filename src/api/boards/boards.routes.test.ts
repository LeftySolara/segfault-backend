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

    it("should respond to POST requests with 201 and a confirmation message", async () => {
      const response: request.Response = await request(app).post("/boards");
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(responseMessage);
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
