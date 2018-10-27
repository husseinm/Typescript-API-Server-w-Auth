import * as request from "supertest"
import app from "../src/app"

describe("GET /api/users", () => {
  it("should return 401 Unauthorized", () => {
    return request(app)
      .get("/api/users")
      .expect(401)
  })
})
