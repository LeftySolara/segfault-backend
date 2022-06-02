import mongoose from "mongoose";
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
      describe("for GET requests", () => {
        it("should respond with 200 and a user object", async () => {
          const username = "getByIdTest";
          const email = "getByIdTest@example.com";
          const password = "34rkmfer3#F$##fR";
          const userId = await testHelpers.generateUserId(
            username,
            email,
            password,
          );

          const response: request.Response = await request(app).get(
            `/users/${userId}`,
          );
          expect(response.statusCode).toBe(200);
          expect(response.body).toMatchObject({
            user: {
              __v: expect.any(Number),
              _id: userId,
              id: userId,
              username,
              email,
              posts: expect.any(Array),
              threads: expect.any(Array),
              joinDate: expect.any(String),
            },
          });
        });

        it("should respond with 404 and an error message if the user does not exist", async () => {
          const response: request.Response = await request(app).get(
            "/users/123456789012",
          );
          expect(response.statusCode).toBe(404);
          expect(response.body).toEqual(responseMessage);
        });
      });

      describe("for PATCH requests", () => {
        it("should respond with 200 and an updated user object", async () => {
          const userId = await testHelpers.generateUserId(
            "original_username",
            "original_email@example.com",
            "original_password123!",
          );

          const username = "new_username";
          const email = "new_email@example.com";
          const password = "new_password123!";
          const response: request.Response = await request(app)
            .patch(`/users/${userId}`)
            .send({
              id: userId,
              username,
              email,
              password,
              confirmPassword: password,
            });

          expect(response.statusCode).toBe(200);
          expect(response.body).toMatchObject({
            user: {
              __v: expect.any(Number),
              _id: new mongoose.Types.ObjectId(userId),
              id: userId,
              username,
              email,
              posts: expect.any(Array),
              threads: expect.any(Array),
              joinDate: expect.any(String),
            },
          });
        });

        it("should respond with 422 and an error message if the username is empty", async () => {
          const userId = await testHelpers.generateUserId(
            "usernameEmpty",
            "usernameEmpty@example.com",
            "original_password123!",
          );

          const username = "";
          const email = "new_email@example.com";
          const password = "new_password123!";
          const response: request.Response = await request(app)
            .patch(`/users/${userId}`)
            .send({
              id: userId,
              username,
              email,
              password,
              confirmPassword: password,
            });

          expect(response.statusCode).toBe(422);
          expect(response.body).toEqual(responseMessage);
        });

        it("should respond with 422 and an error message if the email address is malformed", async () => {
          const userId = await testHelpers.generateUserId(
            "malformed_email",
            "malformedEmail@example.com",
            "original_password123!",
          );

          const username = "malformed_email";
          const email = "new_email_address";
          const password = "new_password123!";
          const response: request.Response = await request(app)
            .patch(`/users/${userId}`)
            .send({
              id: userId,
              username,
              email,
              password,
              confirmPassword: password,
            });

          expect(response.statusCode).toBe(422);
          expect(response.body).toEqual(responseMessage);
        });

        it("should respond with 422 and an error message if the password does not meet minimum requirements", async () => {
          const userId = await testHelpers.generateUserId(
            "weak_password",
            "weakPassword@example.com",
            "original_password123!",
          );

          const username = "weak_password";
          const email = "weakPassword@example.com";
          const password = "1234";
          const response: request.Response = await request(app)
            .patch(`/users/${userId}`)
            .send({
              id: userId,
              username,
              email,
              password,
              confirmPassword: password,
            });

          expect(response.statusCode).toBe(422);
          expect(response.body).toEqual(responseMessage);
        });
      });
    }),
  ];
});
