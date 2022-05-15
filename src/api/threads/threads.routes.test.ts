import request from "supertest";
import app from "../../app";

describe("Test the routes at /threads", () => {
  const responseMessage = expect.objectContaining({
    message: expect.any(String),
  });

  describe("the endpoint /threads", () => {
    it("should respond to GET requests by returning 200 and a confirmation message", async () => {
      const response: request.Response = await request(app).get("/threads");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(responseMessage);
    });

    it("should respond to POST requests with 201 and a confirmation message", async () => {
      const response: request.Response = await request(app).post("/threads");
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(responseMessage);
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
