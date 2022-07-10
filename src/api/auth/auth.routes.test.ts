import request from "supertest";
import testHelpers from "../../utils/testHelpers";
import app from "../../app";

describe("Test the routes at /auth", () => {
  testHelpers.routeTestInit(app);

  describe("the endpoint /login", () => {
    describe("for POST requests", () => {
      it("should respond with 200 and a loginInfo object", async () => {
        const user = await testHelpers.generateUser();

        const payload = {
          email: user.email,
          password: "password123!",
        };

        const response: request.Response = await request(app)
          .post("/auth/login")
          .send(payload);
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
          loginInfo: {
            userId: user.userId,
            email: user.email,
            username: user.username,
            token: expect.any(String),
          },
        });
      });

      it("should respond with 401 and an error message if the credentials are invalid", async () => {
        const user = await testHelpers.generateUser();

        const payload = {
          email: user.email,
          password: "wrong password",
        };

        const response: request.Response = await request(app)
          .post("/auth/login")
          .send(payload);
        expect(response.statusCode).toBe(401);
        expect(response.body).toMatchObject({ message: expect.any(String) });
      });
    });
  });
});
