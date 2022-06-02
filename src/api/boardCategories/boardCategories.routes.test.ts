import request from "supertest";
import testHelpers from "../../utils/testHelpers";
import app from "../../app";

describe("Test the routes at /boardCategories", () => {
  const responseMessage = expect.objectContaining({
    message: expect.any(String),
  });

  const boardCategoryObject = expect.objectContaining({
    __v: expect.any(Number),
    _id: expect.any(String),
    boards: expect.any(Array),
    id: expect.any(String),
    sortOrder: expect.any(Number),
    topic: expect.any(String),
  });

  testHelpers.routeTestInit(app);

  describe("the endpoint /boardCategories", () => {
    describe("for GET requests", () => {
      it("should respond by returning 200 and an array of boardCategory objects", async () => {
        // Create a category to fetch
        const payload = { topic: "Example Category", sortOrder: 1 };
        await request(app).post("/boardCategories").send(payload);

        const response: request.Response = await request(app).get(
          "/boardCategories",
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
          categories: [boardCategoryObject],
        });
      });
    });

    describe("for POST requests", () => {
      it("should respond by returning 201 and a the new category object", async () => {
        const payload = { topic: "POST Test", sortOrder: 0 };
        const response: request.Response = await request(app)
          .post("/boardCategories")
          .send(payload);
        expect(response.statusCode).toBe(201);
        expect(response.body.category).toEqual(boardCategoryObject);
      });

      it("should respond by returning 422 and an error message when the category already exists", async () => {
        const payload = { topic: "POST Test", sortOrder: 0 };
        await request(app).post("/boardCategories").send(payload);

        const response: request.Response = await request(app)
          .post("/boardCategories")
          .send(payload);
        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual(responseMessage);
      });

      it("should respond by returning 422 and an error message when inputs are invalid", async () => {
        const payload = { topic: "Should respond 422", sortOrder: "A string" };
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
    describe("for GET requests", () => {
      it("should return 200 and a board category object", async () => {
        const id = await testHelpers.generateCategoryId("GET Test");

        const response: request.Response = await request(app).get(
          `/boardCategories/${id}`,
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ category: boardCategoryObject });
      });

      it("should return 404 and an error message when the category cannot be found", async () => {
        const response: request.Response = await request(app).get(
          "/boardCategories/123456789012",
        );
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(responseMessage);
      });
    });

    describe("for PATCH requests", () => {
      it("should return 200 and the updated category object", async () => {
        const id = await testHelpers.generateCategoryId("PATCH Test");
        const topic: string = "Updated Category";
        const sortOrder: number = 2;

        const payload = { topic, sortOrder };
        const response: request.Response = await request(app)
          .patch(`/boardCategories/${id}`)
          .send(payload);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ category: boardCategoryObject });
        expect(response.body.category.topic).toBe("Updated Category");
        expect(response.body.category.sortOrder).toBe(sortOrder);
      });

      it("should return 404 and an error message if the category does not exist", async () => {
        const response: request.Response = await request(app)
          .patch("/boardCategories/123")
          .send({ topic: "Hello", sortOrder: 5 });
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(responseMessage);
      });

      it("should return 422 and an error message if the request body is malformed", async () => {
        const response: request.Response = await request(app)
          .patch("/boardCategories/123")
          .send({ topic: 123, sortOrder: "A string" });
        expect(response.statusCode).toBe(422);
        expect(response.body).toEqual(responseMessage);
      });
    });

    describe("for DELETE requests", () => {
      it("should return 200 and the deleted category", async () => {
        const id = await testHelpers.generateCategoryId("DELETE Test");

        const response: request.Response = await request(app).del(
          `/boardCategories/${id}`,
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ category: boardCategoryObject });

        // Verify the category was actually deleted
        const getResponse: request.Response = await request(app).get(
          `/boardCategories/${id}`,
        );
        expect(getResponse.statusCode).toBe(404);
        expect(getResponse.body).toEqual(responseMessage);
      });

      it("should return 404 and an error message if the category does not exist", async () => {
        const response: request.Response = await request(app).del(
          "/boardCategories/123456789012",
        );
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(responseMessage);
      });
    });
  });
});
