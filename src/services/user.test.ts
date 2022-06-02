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

  describe("getById", () => {
    it("should return an object containing user information", async () => {
      const username = "getById";
      const email = "getById@example.com";
      const password = "34Fg76h$%^ht^7h";
      const userId = await testHelpers.generateUserId(
        username,
        email,
        password,
      );

      const userObj = await UserService.getById(userId);

      expect(userObj).toMatchObject({
        _id: new mongoose.Types.ObjectId(userId),
        id: userId,
        username,
        email,
        threads: expect.any(Array),
        posts: expect.any(Array),
        joinDate: expect.any(Date),
      });
    });

    it("should throw an error if the user cannot be found", () => {
      expect(
        async () => await UserService.getById("123456789012"),
      ).rejects.toThrow();
    });
  });

  describe("update", () => {
    it("should return an object containing updated user information", async () => {
      const userId = await testHelpers.generateUserId(
        "original_username",
        "original_email@example.com",
        "original_password123"!,
      );

      const username = "new_username";
      const email = "new_email@example.com";
      const password = "new_password123!";
      const userInfo = await UserService.update(
        userId,
        username,
        email,
        password,
      );

      expect(userInfo).toMatchObject({
        __v: expect.any(Number),
        _id: new mongoose.Types.ObjectId(userId),
        id: userId,
        username,
        email,
        posts: expect.any(Array),
        threads: expect.any(Array),
        joinDate: expect.any(Date),
      });
    });

    it("should throw an error if the user does not exist", () => {
      expect(
        async () =>
          await UserService.update(
            "123456789012",
            "username",
            "email",
            "password",
          ),
      ).rejects.toThrow();
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
