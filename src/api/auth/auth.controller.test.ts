import { Request, Response } from "express";
import testHelpers from "../../utils/testHelpers";
import controller from "./auth.controller";

describe("The Auth controller", () => {
  testHelpers.controllerTestInit();

  describe("login", () => {
    it("should return 200 and a user object", async () => {
      const user = await testHelpers.generateUser();

      const req = {
        body: {
          email: user.email,
          password: "password123!",
        },
      } as unknown;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.login(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(200);
      expect((mRes.json as any).mock.calls[0][0]).toMatchObject({
        id: user.userId,
        email: user.email,
        username: user.username,
      });
    });

    it("should return 401 and an error message if the credentials are invalid", async () => {
      const user = await testHelpers.generateUser();

      const req = {
        body: {
          email: user.email,
          password: "wrong password",
        },
      } as unknown;

      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown;

      await controller.login(
        req as Request,
        mockResponse as Response,
        jest.fn(),
      );

      const mRes = mockResponse as Response;
      expect(mRes.status).toBeCalledWith(401);
      expect(mRes.json).toBeCalledWith({ message: expect.any(String) });
    });
  });
});
