import request from "supertest";
import testHelpers from "../../utils/testHelpers";
import app from "../../app";

describe("Test the routes at /boardCategories", () => {
  const responseMessage = expect.objectContaining({
    message: expect.any(String),
  });

  testHelpers.routeTestInit(app);

  describe("the endpoint /boardCategories", () => {
    describe("for GET requests", () => {
      it("should respond by returning 200 and a confirmation message when successful", async () => {
        const response: request.Response = await request(app).get(
          "/boardCategories",
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(responseMessage);
      });
    });

    describe("for POST requests", () => {
      it("should respond by returning 201 and a confirmation message when successful", async () => {
        const payload = { topic: "Test Category", sortOrder: 0 };
        const response: request.Response = await request(app)
          .post("/boardCategories")
          .send(payload);
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(responseMessage);
      });

      it("should respond by returning 422 and an error message when the category already exists", async () => {
        const payload = { topic: "Test Category", sortOrder: 0 };
        const response: request.Response = await request(app)
          .post("/boardCategories")
          .send(payload);
        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual(responseMessage);
      });

      it("should respond by returning 422 and an error message when inputs are invalid", async () => {
        const payload = { topic: "Test Category", sortOrder: "A string" };
        const response: request.Response = await request(app)
          .post("/boardCategories")
          .send(payload);
        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual(responseMessage);
      });

      it("should respond by returning 422 and an error message when inputs are empty", async () => {
        const payload = {};
        const response: request.Response = await request(app)
          .post("/boardCategories")
          .send(payload);
        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual(responseMessage);
      });
    });
  });

  describe("the endpoint /boardCategories/{id}", () => {
    it("should respond to GET requests by returning 200 and a confirmation message", async () => {
      const response: request.Response = await request(app).get(
        "/boardCategories/123",
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(responseMessage);
    });

    it("should respond to PATCH requests by returning 200 and a confirmation message", async () => {
      const response: request.Response = await request(app).patch(
        "/boardCategories/123",
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(responseMessage);
    });

    it("should respond to DELETE requests by returning 200 and a confirmation message", async () => {
      const response: request.Response = await request(app).delete(
        "/boardCategories/123",
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(responseMessage);
    });
  });
});
