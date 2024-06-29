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

const authTokens = { john: "a", john2: "b", johnRefresh: "r" };

describe("test index endpoints", () => {
  it("test signup", async () => {
    const password = await bcrypt.hash("maybe45", 8);
    const res = await request(app).post("/signup").send({
      username: "john",
      password: password,
      phoneNumber: "19123984506",
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Registered successfully");
    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.refreshToken).toBeTruthy();
    const newUser = await request(app).get("/users/john");
    expect(newUser.body.user.username).toBe("john");
    expect(bcrypt.compare("maybe45", newUser.body.user.password)).toBeTruthy();
  });
  it("test signup with existing username", async () => {
    const password = await bcrypt.hash("12345", 8);
    const res = await request(app).post("/signup").send({
      username: "john",
      password: password,
      phoneNumber: "19123984508",
    });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("This username is taken");
  });
  it("test signup with existing phone number", async () => {
    const password = await bcrypt.hash("12345", 8);
    const res = await request(app).post("/signup").send({
      username: "milly",
      password: password,
      phoneNumber: "19123984506",
    });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("This phone number is taken");
  });
  it("login correct username and password", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "john", password: "maybe45" });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.refreshToken).toBeTruthy();
    authTokens.john = "Bearer " + res.body.accessToken;
    authTokens.johnRefresh = "Bearer " + res.body.refreshToken;
  });
  it("login correct username incorrect password", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "john", password: "12345" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Incorrect password");
    expect(res.body.accessToken).not.toBeTruthy();
    expect(res.body.refreshToken).not.toBeTruthy();
  });
  it("login incorrect username", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "johns", password: "12345" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid username");
    expect(res.body.accessToken).not.toBeTruthy();
    expect(res.body.refreshToken).not.toBeTruthy();
  });
  it("test refresh token", async () => {
    const res = await request(app)
      .post("/refresh")
      .set("Authorization", authTokens.johnRefresh);
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeTruthy();
  });
  it("test refresh token - invalid refresh", async () => {
    const res = await request(app).post("/refresh").set("Authorization", "hi");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized");
  });
});

// users -------------------------------------------------------->
describe("test user endpoints", () => {
  it("test get all users - no auth token", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized, token not available");
  });
  it("test get all users - bad auth token", async () => {
    const res = await request(app).get("/users").set("Authorization", "hi");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized");
  });
  it("test get all users", async () => {
    const res = await request(app)
      .get("/users")
      .set("Authorization", authTokens.john);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBeTruthy();
    expect(res.body.users.length).toBe(8);
  });
  it("test get user by id - no auth token", async () => {
    const res = await request(app).get("/users/account");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized, token not available");
  });
  it("test get user by id  -bad auth token", async () => {
    const res = await request(app)
      .get("/users/account")
      .set("Authorization", "hi");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized");
  });
  it("test get user by id", async () => {
    const res = await request(app)
      .get("/users/account")
      .set("Authorization", authTokens.john);
    expect(res.status).toBe(200);
    expect(res.body.user.user_id).toBe(8);
    expect(res.body.user.username).toBe("john");
    expect(bcrypt.compare("maybe45", res.body.user.password)).toBeTruthy();
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
      .set("Authorization", authTokens.john)
      .send({ queryTerm: "o" });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBeTruthy();
    expect(res.body.users.length).toBe(5);
  });
  it("test query usernames - no auth token", async () => {
    const res = await request(app)
      .post("/users/search")
      .send({ queryTerm: "111" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized, token not available");
  });
  it("test query usernames - bad auth token", async () => {
    const res = await request(app)
      .post("/users/search")
      .set("Authorization", "hi")
      .send({ queryTerm: "o" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized");
  });
  it("test query usernames - one matching username", async () => {
    const res = await request(app)
      .post("/users/search")
      .set("Authorization", authTokens.john)
      .send({ queryTerm: "Test1" });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBeTruthy();
    expect(res.body.users.length).toBe(1);
  });
  it("test query usernames - no matching usenames", async () => {
    const res = await request(app)
      .post("/users/search")
      .set("Authorization", authTokens.john)
      .send({ queryTerm: "111" });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBeTruthy();
    expect(res.body.users.length).toBe(0);
  });
  it("test update username - same username", async () => {
    const res = await request(app)
      .put("/users/8/username")
      .set("Authorization", authTokens.john)
      .send({ newUsername: "john" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid new username");
  });
  it("test update username - no new username", async () => {
    const res = await request(app)
      .put("/users/8/username")
      .set("Authorization", authTokens.john);
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid new username");
  });
  it("test update username - no auth token", async () => {
    const res = await request(app)
      .put("/users/8/username")
      .send({ newUsername: "john2" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized, token not available");
  });
  it("test update username - bad auth token", async () => {
    const res = await request(app)
      .put("/users/8/username")
      .set("Authorization", "hi")
      .send({ newUsername: "john2" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized");
  });
  it("test update username", async () => {
    const res = await request(app)
      .put("/users/8/username")
      .set("Authorization", authTokens.john)
      .send({ newUsername: "john2" });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.refreshToken).toBeTruthy();
    authTokens.john2 = "Bearer " + res.body.accessToken;
    expect(res.body.message).toBe("Username updated successfully");
    const updated = await request(app)
      .get("/users/account")
      .set("Authorization", authTokens.john2);
    expect(updated.body.user.username).toBe("john2");
  });
  it("test update password - no auth token", async () => {
    const res = await request(app).put("/users/8/password").send({
      newPassword: "password1",
    });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized, token not available");
  });
  it("test update password - bad auth token", async () => {
    const res = await request(app)
      .put("/users/8/password")
      .set("Authorization", "hi")
      .send({
        newPassword: "password1",
      });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized");
  });
  it("test update password", async () => {
    const res = await request(app)
      .put("/users/8/password")
      .set("Authorization", authTokens.john2)
      .send({
        newPassword: "password1",
      });
    expect(res.status).toBe(200);
    const updated = await request(app)
      .get("/users/account")
      .set("Authorization", authTokens.john2);
    expect(
      bcrypt.compare("password1", updated.body.user.password)
    ).toBeTruthy();
  });
  it("test user delete - no auth token", async () => {
    const res = await request(app).delete("/users/8");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized, token not available");
  });
  it("test user delete - bad auth token", async () => {
    const res = await request(app)
      .delete("/users/8")
      .set("Authorization", "hi");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized");
  });
  it("test user delete", async () => {
    const res = await request(app)
      .delete("/users/8")
      .set("Authorization", authTokens.john2);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully deleted");
  });
});

// sessions -------------------------------------------------------->
describe("test session endpoints", () => {
  it("test session create", async () => {
    const login = await request(app)
      .post("/login")
      .send({ username: "Test1", password: "password" });
    expect(login.status).toBe(200);
    authTokens.Test1 = "Bearer " + login.body.accessToken;
    const res = await request(app)
      .post("/sessions/new")
      .set("Authorization", authTokens.Test1)
      .send({
        session_name: "Test Session",
        session_photo: "",
        scheduled_at: new Date("August 17, 2024 03:24:00"),
        address: "100 Cherry Ln Brewster, NY 10000",
        location_lat: 200,
        location_long: 300,
        radius: 20,
        budget_min: 10,
        budget_max: 30,
        rating: 3.5,
      });
    expect(res.status).toBe(200);
    expect(res.body.sessionId).toBe(2);
  });
  it("test get sessions by user id", async () => {
    const res = await request(app)
      .get("/sessions")
      .set("Authorization", authTokens.Test1);
    console.log(res.body);
    expect(res.status).toBe(200);
  });
  it("test get past sessions by user id", async () => {
    const res = await request(app)
      .get("/sessions")
      .query({ time: "past" })
      .set("Authorization", authTokens.Test1);
    console.log(res.body);
    expect(res.status).toBe(200);
  });
  it("test get future sessions by user id", async () => {
    const res = await request(app)
      .get("/sessions")
      .query({ time: "future" })
      .set("Authorization", authTokens.Test1);
    console.log(res.body);
    expect(res.status).toBe(200);
  });
  it("test get session by id", async () => {
    const res = await request(app)
      .get("/sessions/2")
      .set("Authorization", authTokens.Test1);
    expect(res.status).toBe(200);
    expect(res.body.session.session_id).toBe(2);
    expect(res.body.session.location_lat).toBe(200);
    expect(res.body.session.location_long).toBe(300);
    expect(res.body.session.session_name).toBe("Test Session");
    expect(res.body.session.session_photo).toBe("");
    expect(res.body.session.scheduled_at).toBe("2024-08-17T07:24:00.000Z");
    expect(res.body.session.address).toBe("100 Cherry Ln Brewster, NY 10000");
    expect(res.body.session.radius).toBe(20);
    expect(res.body.session.budget_min).toBe(10);
    expect(res.body.session.budget_max).toBe(30);
    expect(res.body.session.rating).toBe(3.5);
    expect(res.body.session.created_at).toBeTruthy();
  });
  it("test add members - add one", async () => {
    const res = await request(app)
      .post("/sessions/2/members/new")
      .set("Authorization", authTokens.Test1)
      .send({ users: ["bob96"] });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully added 1 new member");
  });
  it("test add members - add multiple", async () => {
    const res = await request(app)
      .post("/sessions/2/members/new")
      .set("Authorization", authTokens.Test1)
      .send({ users: ["ghostBoy97", "linda45"] });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully added 2 new members");
  });
  it("test add members - add some non-existent", async () => {
    const res = await request(app)
      .post("/sessions/2/members/new")
      .set("Authorization", authTokens.Test1)
      .send({ users: ["24601", "linda47"] });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully added 1 new member");
    expect(res.body.errors[0]).toBe(
      "Some users could not be added: users not found"
    );
  });
  it("test add members - no users exist", async () => {
    const res = await request(app)
      .post("/sessions/2/members/new")
      .set("Authorization", authTokens.Test1)
      .send({ users: ["24602", "linda47"] });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Could not find users to add");
  });
  it("test add members - members already in session", async () => {
    const res = await request(app)
      .post("/sessions/2/members/new")
      .set("Authorization", authTokens.Test1)
      .send({ users: ["24601", "linda45"] });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("All users already in session");
  });
  it("test list session members", async () => {
    const res = await request(app)
      .get("/sessions/2/members")
      .set("Authorization", authTokens.Test1);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.members)).toBeTruthy();
    expect(res.body.members.length).toBe(5);
  });
  it("test session search", async () => {
    const res = await request(app)
      .post("/sessions/search")
      .set("Authorization", authTokens.Test1)
      .send({ queryTerm: "o" });
  });
  it("test delete member from session", async () => {
    const res = await request(app)
      .delete("/sessions/2/members/4")
      .set("Authorization", authTokens.Test1);
    expect(res.status).toBe(200);
  });
  it("test update session data", async () => {
    const res = await request(app)
      .put("/sessions/2")
      .set("Authorization", authTokens.Test1)
      .send({
        session_name: "Test Session",
        session_photo: "",
        scheduled_at: new Date("August 17, 2024 03:24:00"),
        address: "100 Cherry Ln Brewster, NY 10000",
        location_lat: 100,
        location_long: 100,
        radius: 20,
        budget_min: 10,
        budget_max: 30,
        rating: 3.5,
      });
    expect(res.status).toBe(200);
    expect(res.body.location_lat).toBe(100);
    expect(res.body.location_long).toBe(100);
  });
  it("test update session data - user not in session", async () => {
    const res = await request(app)
      .put("/sessions/2")
      .set("Authorization", authTokens.john)
      .send({
        session_name: "Test Session",
        session_photo: "",
        scheduled_at: new Date("August 17, 2024 03:24:00"),
        address: "100 Cherry Ln Brewster, NY 10000",
        location_lat: 50,
        location_long: 50,
        radius: 20,
        budget_min: 10,
        budget_max: 30,
        rating: 3.5,
      });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized, user not in session");
  });
  it("test update session data - bad token", async () => {
    const res = await request(app)
      .put("/sessions/2")
      .set("Authorization", "hi")
      .send({
        session_name: "Test Session",
        session_photo: "",
        scheduled_at: new Date("August 17, 2024 03:24:00"),
        address: "100 Cherry Ln Brewster, NY 10000",
        location_lat: 50,
        location_long: 50,
        radius: 20,
        budget_min: 10,
        budget_max: 30,
        rating: 3.5,
      });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized");
  });
  it("test update session data - no token", async () => {
    const res = await request(app)
      .put("/sessions/2")
      .send({
        session_name: "Test Session",
        session_photo: "",
        scheduled_at: new Date("August 17, 2024 03:24:00"),
        address: "100 Cherry Ln Brewster, NY 10000",
        location_lat: 50,
        location_long: 50,
        radius: 20,
        budget_min: 10,
        budget_max: 30,
        rating: 3.5,
      });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized, token not available");
  });
  it("test like session", async () => {
    const res = await request(app)
      .put("/sessions/2")
      .send({
        liked: 0,
      })
      .set("Authorization", authTokens.Test1);
    expect(res.status).toBe(200);
    expect(res.body.liked).toBe(false);
  });
  it("test update session chosen restaurant", async () => {
    const res = await request(app)
      .put("/sessions/2")
      .set("Authorization", authTokens.Test1)
      .send({ restaurant: "aRestaurantId" });
    expect(res.status).toBe(200);
    expect(res.body.chosen_restaurant).toBe("aRestaurantId");
  });
  it("test delete session", async () => {
    const res = await request(app)
      .delete("/sessions/2")
      .set("Authorization", authTokens.Test1);
    expect(res.status).toBe(200);
  });
});

// restaurants ------------------------------------------------>
describe("test session restaurants", () => {
  it("test get restaurants", async () => {
    const res = await request(app)
      .get("/sessions/1/restaurants")
      .set("Authorization", authTokens.Test1);

    expect(res.status).toBe(200);
  });
  it("test add restaurant - insufficient data", async () => {
    const res = await request(app)
      .post("/sessions/1/restaurants")
      .set("Authorization", authTokens.Test1)
      .send({ place_id: "resM" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Missing restaurant data");
  });
  it("test add restaurant - like", async () => {
    const res = await request(app)
      .post("/sessions/1/restaurants")
      .query({ approved: 1 })
      .set("Authorization", authTokens.Test1)
      .send({ place_id: "resM" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully added");
    expect(res.body.liked).toBeTruthy();
  });
  it("test add restaurant - already exists", async () => {
    const res = await request(app)
      .post("/sessions/1/restaurants")
      .query({ approved: 0 })
      .set("Authorization", authTokens.Test1)
      .send({ place_id: "resM" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Restaurant already exists");
  });
  it("test delete restaurant", async () => {
    const res = await request(app)
      .delete("/sessions/1/restaurants/resM")
      .set("Authorization", authTokens.Test1);

    expect(res.status).toBe(200);
  });
  it("test add restaurant - dislike", async () => {
    const res = await request(app)
      .post("/sessions/1/restaurants")
      .query({ approved: 0 })
      .set("Authorization", authTokens.Test1)
      .send({ place_id: "resM" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully added");
    expect(res.body.liked).not.toBeTruthy();
  });
  it("test update restaurant", async () => {
    const res = await request(app)
      .put("/sessions/1/restaurants")
      .query({ approved: 1 })
      .set("Authorization", authTokens.Test1)
      .send({ place_id: "resM" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully updated");
    expect(res.body.liked).toBeTruthy();
  });
});

// GOOGLE ENDPOINTS =================================================>
describe("test google endpoints", () => {
  it("test sample data", async () => {
    const res = await request(app)
      .get("/restaurants/test")
      .set("Authorization", authTokens.Test1);
    console.log(res.body.results);
    expect(res.status).toBe(200);
  });
  // it("test nearby search", async () => {
  //   const res = await request(app).get("/restaurants");
  //   expect(res.status).toBe(200);
  //   expect(res.body.message).toBe("this is working");
  // });
});

// describe("test auth middleware", () => {
//   it("test create auth token", async () => {
//     const res = await request(app)
//       .post("/auth")
//       .send({ username: "Test2", password: "password" });
//     expect(res.status).toBe(200);
//     expect(res.body.accessToken).toBeTruthy();
//     expect(res.body.refreshToken).toBeTruthy();
//   });
//   it("test verify access token", async () => {
//     const res = await request(app)
//       .post("/auth")
//       .send({ username: "Test3", password: "password" });
//     expect(res.status).toBe(200);
//     const ver = await request(app)
//       .post("/verify")
//       .set("authorization", res.body.accessToken);
//     console.log(ver.body.message);
//     expect(ver.status).toBe(200);
//     expect(ver.body.message).toBe("Authorized user 8 - Test3");
//   });
//   it("test refresh token", async () => {
//     const res = await request(app)
//       .post("/auth")
//       .send({ username: "Test4", password: "password" });
//     expect(res.status).toBe(200);
//     const ver = await request(app)
//       .post("/refresh")
//       .set("authorization", res.body.refreshToken);
//     expect(ver.status).toBe(200);
//     expect(ver.body.accessToken).toBeTruthy();
//   });
// });
