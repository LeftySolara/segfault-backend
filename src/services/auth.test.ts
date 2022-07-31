import testHelpers from "../utils/testHelpers";
import authService from "./auth";

describe("The Auth service", () => {
  testHelpers.serviceTestInit();

  describe("login", () => {
    it("should return an object containing login information", async () => {
      const user = await testHelpers.generateUser();
      const loginInfo = await authService.login(user.email, "password123!");

      expect(loginInfo).toEqual({
        id: user.userId,
        email: user.email,
        username: user.username,
        token: expect.any(String),
      });
    });

    it("should throw an error if the password is incorrect", async () => {
      const user = await testHelpers.generateUser();
      expect(
        async () => await authService.login(user.email, "wrong password"),
      ).rejects.toThrow();
    });

    it("should throw an error if the user does not exist", async () => {
      expect(
        async () => await authService.login("example@example.com", "1234"),
      ).rejects.toThrow();
    });
  });
});
