import request from "supertest";
import testHelpers from "../../utils/testHelpers";
import app from "../../app";

describe("Test the routes at /users", () => {
  const responseMessage = expect.objectContaining({
    message: expect.any(String),
  });

  const userObject = expect.objectContaining({
    _id: expect.any(String),
    email: expect.any(String),
    password: expect.any(String),
    posts: expect.any(Array),
    threads: expect.any(Array),
    joinDate: expect.any(String),
  });

  testHelpers.routeTestInit(app);
  [
    describe("the endpoint /users", () => {
      const usersArray = expect.arrayContaining([userObject]);

      it("should respond to GET requests by returning 200 and a list of user objects", async () => {
        const response: request.Response = await request(app).get("/users");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
          expect.objectContaining({ users: usersArray }),
        );
      });

      it("should respond to POST requests with 201 and a confirmation message upon success", async () => {
        const response: request.Response = await request(app).post("/users");
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(responseMessage);
      });
    }),
    describe("the endpoint /users/{id}", () => {
      it("should respond to GET requests by returning 200 and a user object", async () => {
        const response: request.Response = await request(app).get("/users/123");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
          expect.objectContaining({ user: userObject }),
        );
      });

      it("should respond to PATCH requests by returning 200 and a confirmation message upon success", async () => {
        const response: request.Response = await request(app).patch(
          "/users/123",
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(responseMessage);
      });

      it("should respond to DELETE requests by returning 200 and a confirmation message upon success", async () => {
        const response: request.Response = await request(app).delete(
          "/users/123",
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(responseMessage);
      });
    }),
  ];
});
