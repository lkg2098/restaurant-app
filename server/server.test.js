const request = require("supertest");
const app = require("./server");
const bcrypt = require("bcrypt");
const db = require("./db");

beforeAll(async () => {
  await db.addTestData();
});
afterAll(() => {
  db.clearTestData();
  app.closeServer();
});
describe("test user endpoints", () => {
  it("test get all users", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBeTruthy();
    expect(res.body.users.length).toBe(5);
  });
  it("test get user by id", async () => {
    const res = await request(app).get("/users/1/account");
    expect(res.status).toBe(200);
    expect(res.body.user.user_id).toBe(1);
    expect(res.body.user.username).toBe("Test1");
    expect(bcrypt.compare("password", res.body.user.password)).toBeTruthy();
  });
  it("test get user by username", async () => {
    const res = await request(app).get("/users/bob96");
    expect(res.status).toBe(200);
    expect(res.body.user.user_id).toBe(2);
    expect(res.body.user.username).toBe("bob96");
    expect(bcrypt.compare("bf123", res.body.user.password)).toBeTruthy();
  });
  it("test query usernames - many matching usernames", async () => {
    const res = await request(app)
      .post("/users/search")
      .send({ queryTerm: "o" });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBeTruthy();
    expect(res.body.users.length).toBe(2);
  });
  it("test query usernames - one matching username", async () => {
    const res = await request(app)
      .post("/users/search")
      .send({ queryTerm: "Test1" });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBeTruthy();
    expect(res.body.users.length).toBe(1);
  });
  it("test query usernames - no matching usenames", async () => {
    const res = await request(app)
      .post("/users/search")
      .send({ queryTerm: "111" });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBeTruthy();
    expect(res.body.users.length).toBe(0);
  });
  it("test update username", async () => {
    const res = await request(app)
      .put("/users/1/username")
      .send({ username: "Test1", password: "password", newUsername: "Test2" });
    expect(res.status).toBe(200);
    const updated = await request(app).get("/users/1/account");
    expect(updated.body.user.username).toBe("Test2");
  });
  it("test update username user does not exist", async () => {
    const res = await request(app)
      .put("/users/1/username")
      .send({ username: "Test3", password: "password", newUsername: "Test1" });
    expect(res.status).toBe(401);
  });
  it("test update username incorrect password", async () => {
    const res = await request(app)
      .put("/users/1/username")
      .send({ username: "Test2", password: "password1", newUsername: "Test1" });
    expect(res.status).toBe(401);
  });
  it("test update username user does not exist", async () => {
    const res = await request(app).put("/users/1/password").send({
      username: "Test2",
      password: "password",
      newPassword: "password1",
    });
    expect(res.status).toBe(200);
    const updated = await request(app).get("/users/1/account");
    expect(
      bcrypt.compare("password1", updated.body.user.password)
    ).toBeTruthy();
  });
  it("test user delete", async () => {
    const res = await request(app).delete("/users/1");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully deleted");
  });
});

describe("test index endpoints", () => {
  it("test signup", async () => {
    const res = await request(app)
      .post("/signup")
      .send({ username: "john", password: "maybe45" });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Registered successfully");
    const newUser = await request(app).get("/users/john");
    expect(newUser.body.user.username).toBe("john");
    expect(bcrypt.compare("maybe45", newUser.body.user.password)).toBeTruthy();
  });
  it("test signup with existing username", async () => {
    console.log("existing username");
    const res = await request(app)
      .post("/signup")
      .send({ username: "john", password: "12345" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("This username is taken");
  });
  it("login correct username and password", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "john", password: "maybe45" });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful");
  });
  it("login correct username incorrect password", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "john", password: "12345" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Incorrect password");
  });
  it("login incorrect username", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "johns", password: "12345" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid username");
  });
});

describe("test session endpoints", () => {
  it("test session create", async () => {
    const res = await request(app)
      .post("/users/2/sessions/new")
      .send({ latitude: 200, longitude: 10, guestUserIds: [3, 4, 5] });
    expect(res.status).toBe(200);
    expect(res.body.sessionId).toBe(1);
  });
  //   it("test list session members", async () => {
  //     const res = await request(app).get("/users/2/sessions/1/members");
  //     expect(res.status).toBe(200);
  //   });
});

describe("test auth middleware", () => {
  it("test create auth token", async () => {
    const res = await request(app)
      .post("/auth")
      .send({ username: "Test2", password: "password" });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.refreshToken).toBeTruthy();
  });
  it("test verify access token", async () => {
    const res = await request(app)
      .post("/auth")
      .send({ username: "Test3", password: "password" });
    expect(res.status).toBe(200);
    const ver = await request(app)
      .post("/verify")
      .set("authorization", res.body.accessToken);
    console.log(ver.body.message);
    expect(ver.status).toBe(200);
    expect(ver.body.message).toBe("Authorized user 8 - Test3");
  });
  it("test refresh token", async () => {
    const res = await request(app)
      .post("/auth")
      .send({ username: "Test4", password: "password" });
    expect(res.status).toBe(200);
    const ver = await request(app)
      .post("/refresh")
      .set("authorization", res.body.refreshToken);
    expect(ver.status).toBe(200);
    expect(ver.body.accessToken).toBeTruthy();
  });
});
