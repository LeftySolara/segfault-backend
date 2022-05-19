import request from "supertest";
import testHelpers from "../../utils/testHelpers";
import app from "../../app";

describe("Test the routes at /boardCategories", () => {
  const responseMessage = expect.objectContaining({
    message: expect.any(String),
  });

  const boardsArray = expect.arrayContaining([
    expect.objectContaining({
      id: expect.any(String),
      topic: expect.any(String),
    }),
  ]);

  const boardCategoryObject = expect.objectContaining({
    __v: expect.any(Number),
    _id: expect.any(String),
    boards: boardsArray,
    id: expect.any(String),
    sortOrder: expect.any(Number),
    topc: expect.any(String),
  });

  const boardCategoryArray = expect.arrayContaining([boardCategoryObject]);

  const boardCategoryResponse = expect.objectContaining({
    boardCategories: boardCategoryArray,
  });

  testHelpers.routeTestInit(app);

  describe("the endpoint /boardCategories", () => {
    // This test fails even when the received output matches the expected output.
    // See issue #25: https://git.julianneadams.info/segfault/segfault-backend/-/issues/25.

    // describe("for GET requests", () => {
    //   it("should respond by returning 200 and an array of boardCategory objects", async () => {
    //     // Create a category to fetch
    //     const payload = { topic: "Example Category", sortOrder: 1 };
    //     await request(app).post("/boardCategories").send(payload);

    //     const response: request.Response = await request(app).get(
    //       "/boardCategories",
    //     );
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body).toEqual({ boardCategories: boardCategoryArray });
    //   });
    // });

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
    it("should respond to GET requests by returning 404 when unsuccessful", async () => {
      const response: request.Response = await request(app).get(
        "/boardCategories/123",
      );
      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual(responseMessage);
    });

    it("should respond to PATCH requests by returning 404 if the category does not exist", async () => {
      const response: request.Response = await request(app)
        .patch("/boardCategories/123")
        .send({ topic: "Hello", sortOrder: 5 });
      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual(responseMessage);
    });

    it("should respond to PATCH requests by returning 422 if the request body is malformed", async () => {
      const response: request.Response = await request(app)
        .patch("/boardCategories/123")
        .send({ topic: 123, sortOrder: "A string" });
      expect(response.statusCode).toBe(422);
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
