import request from "supertest";
import testHelpers from "../../utils/testHelpers";
import app from "../../app";

describe("The health check endpoint", () => {
  const responseData = expect.objectContaining({
    uptime: expect.any(Number),
    message: expect.any(String),
    timestamp: expect.any(Number),
  });

  testHelpers.routeTestInit(app);

  it("should respond with application health information", async () => {
    const response: request.Response = await request(app).get("/healthCheck");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ data: responseData }),
    );
  });
});
