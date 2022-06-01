import request from "supertest";
import testHelpers from "../../utils/testHelpers";
import app from "../../app";

describe("Test the routes at /users", () => {
  const responseMessage = expect.objectContaining({
    message: expect.any(String),
  });

  const userObject = expect.objectContaining({
    _id: expect.any(String),
    id: expect.any(String),
    username: expect.any(String),
    email: expect.any(String),
    posts: expect.any(Array),
    threads: expect.any(Array),
    joinDate: expect.any(String),
  });

  testHelpers.routeTestInit(app);
  [
    describe("the endpoint /users", () => {
      describe("for GET requests", () => {
        it("should respond with 200 and an array of user objects", async () => {
          // Create a user to fetch
          const username = "GET_test";
          const email = "getTest@example.com";
          const password = "password123!@#";
          await request(app)
            .post("/users")
            .send({ username, email, password, confirmPassword: password });

          const response: request.Response = await request(app).get("/users");
          expect(response.statusCode).toBe(200);
          expect(response.body).toEqual({ users: [userObject] });
        });
      });

      describe("for POST requests", () => {
        it("should respond with 201 and a user object", async () => {
          const username = "POST_test";
          const email = "post_test@example.com";
          const password = "34ijf903#$F3#F^7";

          const response: request.Response = await request(app)
            .post("/users")
            .send({
              username,
              email,
              password,
              confirmPassword: password,
            });
          expect(response.statusCode).toBe(201);
          expect(response.body).toMatchObject({
            user: {
              username,
              email,
              userId: expect.any(String),
              token: expect.any(String),
            },
          });
        });

        it("should respond with 422 if the user already exists", async () => {
          const username = "422_test";
          const email = "422@example.com";
          const password = "ef34F$#f#F343fF#";

          await request(app).post("/users").send({
            username,
            email,
            password,
            confirmPassword: password,
          });

          const response: request.Response = await request(app)
            .post("/users")
            .send({ username, email, password, confirmPassword: password });

          expect(response.statusCode).toBe(422);
          expect(response.body).toEqual(responseMessage);
        });

        it("should respond with 422 when passwords do not match", async () => {
          const response: request.Response = await request(app)
            .post("/users")
            .send({
              username: "testing",
              email: "testing@example.com",
              password: "eprmf34fp3m#F3#$F#",
              confirmPassword: "34f##$F3ffT%tt%fg",
            });

          expect(response.statusCode).toBe(422);
          expect(response.body).toEqual(responseMessage);
        });

        it("should respond with 422 when the username is empty", async () => {
          const response: request.Response = await request(app)
            .post("/users")
            .send({
              username: "",
              email: "blank@example.com",
              password: "eprmf34fp3m#F3#$F#",
              confirmPassword: "eprmf34fp3m#F3#$F#",
            });

          expect(response.statusCode).toBe(422);
          expect(response.body).toEqual(responseMessage);
        });

        it("should respond with 422 when the email is not properly formatted", async () => {
          const response: request.Response = await request(app)
            .post("/users")
            .send({
              username: "another_test",
              email: "This is an email address",
              password: "eprmf34fp3m#F3#$F#",
              confirmPassword: "eprmf34fp3m#F3#$F#",
            });

          expect(response.statusCode).toBe(422);
          expect(response.body).toEqual(responseMessage);
        });

        it("should respond with 422 if the password is not strong enough", async () => {
          const response: request.Response = await request(app)
            .post("/users")
            .send({
              username: "password_test",
              email: "password@example.com",
              password: "hello",
              confirmPassword: "hello",
            });

          expect(response.statusCode).toBe(422);
          expect(response.body).toEqual(responseMessage);
        });
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
