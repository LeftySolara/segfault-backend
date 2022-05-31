import mongoose from "mongoose";
import testHelpers from "../utils/testHelpers";
import UserService from "./user";

describe("The User service", () => {
  testHelpers.serviceTestInit();

  describe("create", () => {
    it("should return an object containing user information", async () => {
      const username = "test_user";
      const email = "test@example.com";
      const userInfo = await UserService.create(username, email, "password");

      expect(userInfo).toMatchObject({
        userId: expect.any(String),
        username,
        email,
        token: expect.any(String),
      });
    });
  });
});
