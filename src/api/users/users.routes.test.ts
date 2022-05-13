import request from "supertest";
import app from "../../app";

describe("Test the routes at /users", () => {
  [
    describe("the endpoint /users", () => {
      const userObject = expect.objectContaining({
        _id: expect.any(String),
        email: expect.any(String),
        password: expect.any(String),
        posts: expect.any(Array),
        threads: expect.any(Array),
        joinDate: expect.any(String),
      });

      const usersArray = expect.arrayContaining([userObject]);

      const responseMessage = expect.objectContaining({
        message: expect.any(String),
      });

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
  ];
});
