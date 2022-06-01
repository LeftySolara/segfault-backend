import mongoose from "mongoose";
import testHelpers from "../utils/testHelpers";
import UserService from "./user";

describe("The User service", () => {
  testHelpers.serviceTestInit();

  describe("getAll", () => {
    it("should return a list of users", async () => {
      const username = "fetch_test";
      const email = "fetch@example.com";

      await UserService.create(username, email, "erf#f34f3#FV6g");

      const users = await UserService.getAll();
      expect(users).toEqual([
        {
          username,
          email,
          _id: expect.any(mongoose.Types.ObjectId),
          id: expect.any(String),
          posts: expect.any(Array),
          threads: expect.any(Array),
          joinDate: expect.any(Date),
          __v: expect.any(Number),
        },
      ]);
    });
  });

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
