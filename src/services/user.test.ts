import mongoose from "mongoose";
import testHelpers from "../utils/testHelpers";
import UserService from "./user";

describe("The User service", () => {
  testHelpers.serviceTestInit();

  describe("getAll", () => {
    it("should return a list of users", async () => {
      const user = await testHelpers.generateUser();
      const users = await UserService.getAll();

      expect(users).toEqual([
        {
          username: user.username,
          email: user.email,
          _id: new mongoose.Types.ObjectId(user.userId),
          id: user.userId,
          posts: [],
          threads: [],
          joinDate: expect.any(Date),
          __v: expect.any(Number),
        },
      ]);
    });
  });

  describe("getById", () => {
    it("should return an object containing user information", async () => {
      const user = await testHelpers.generateUser();
      const userObj = await UserService.getById(user.userId);

      expect(userObj).toMatchObject({
        _id: new mongoose.Types.ObjectId(user.userId),
        id: user.userId,
        username: user.username,
        email: user.email,
        threads: [],
        posts: [],
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
      const user = await testHelpers.generateUser();
      const username = "new_username";
      const email = "new_email@example.com";
      const password = "new_password123!";

      const userInfo = await UserService.update(
        user.userId,
        username,
        email,
        password,
      );

      expect(userInfo).toMatchObject({
        __v: expect.any(Number),
        _id: new mongoose.Types.ObjectId(user.userId),
        id: user.userId,
        username,
        email,
        posts: [],
        threads: [],
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
