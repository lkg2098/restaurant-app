const request = require("supertest");
const app = require("./server");
const bcrypt = require("bcrypt");
// const db = require("./db");
const pool = require("./pool");

// beforeAll(async () => {
//   await db.addTestData();
// });
afterAll(async () => {
  // db.clearTestData();
  await pool.clearTestData();
  pool.end();
  app.closeServer();
});

const authTokens = { john: "a", john2: "b", johnRefresh: "r" };
const userData = { john: { id: "a" } };
let testMealId = 1;

describe("test index endpoints", () => {
  it("test test endpoint", async () => {
    const res = await request(app).get("/test");
    expect(res.status).toBe(200);
  });
  it("test signup", async () => {
    const res = await request(app).post("/signup").send({
      username: "john",
      password: "maybe45",
      phoneNumber: "19123984506",
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Registered successfully");
    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.refreshToken).toBeTruthy();
    userData.john.id = res.body.userId.user_id;
    const newUser = await request(app).get("/users/john");
    expect(newUser.body.user.username).toBe("john");
    expect(bcrypt.compare("maybe45", newUser.body.user.password)).toBeTruthy();
  });
  it("test signup with existing username", async () => {
    const res = await request(app).post("/signup").send({
      username: "john",
      password: "12345",
      phoneNumber: "19123984508",
    });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("This username is taken");
  });
  it("test signup with existing phone number", async () => {
    const res = await request(app).post("/signup").send({
      username: "milly",
      password: "12345",
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
  it("test verification code", async () => {
    const res = await request(app).get("/verifyPhone");
    expect(res.status).toBe(200);
    expect(res.body.smsCode.toString().length).toBe(4);
  });
});

// // users -------------------------------------------------------->
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
    expect(res.body.user.user_id).toBe(userData.john.id);
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
  it("test update name", async () => {
    const res = await request(app)
      .put("/users/account")
      .send({ name: "John" })
      .set("Authorization", authTokens.john);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully updated");
    const user = await request(app)
      .get("/users/account")
      .set("Authorization", authTokens.john);
    expect(user.body.user.name).toBe("John");
  });

  it("test update phone number", async () => {
    const res = await request(app)
      .put("/users/account")
      .send({ phone_number: "19234499432" })
      .set("Authorization", authTokens.john);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully updated");
    const user = await request(app)
      .get("/users/account")
      .set("Authorization", authTokens.john);
    expect(user.body.user.phone_number).toBe("19234499432");
  });
  it("test update profile image", async () => {
    const res = await request(app)
      .put("/users/account")
      .send({ profile_image: "http://abc" })
      .set("Authorization", authTokens.john);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully updated");
    const user = await request(app)
      .get("/users/account")
      .set("Authorization", authTokens.john);
    expect(user.body.user.profile_image).toBe("http://abc");
  });
  it("test update push token", async () => {
    const res = await request(app)
      .put("/users/account")
      .send({ push_token: "drtHDw5wcyD" })
      .set("Authorization", authTokens.john);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully updated");
    const user = await request(app)
      .get("/users/account")
      .set("Authorization", authTokens.john);
    expect(user.body.user.push_token).toBe("drtHDw5wcyD");
  });
  it("test query usernames - many matching usernames", async () => {
    const res = await request(app)
      .post("/users/search")
      .set("Authorization", authTokens.john)
      .send({ queryTerm: "o" });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBeTruthy();
    expect(res.body.users.length >= 4).toBeTruthy();
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
      .put("/users/account/username")
      .set("Authorization", authTokens.john)
      .send({ newUsername: "john" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid new username");
  });
  it("test update username - no new username", async () => {
    const res = await request(app)
      .put("/users/account/username")
      .set("Authorization", authTokens.john);
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid new username");
  });
  it("test update username - no auth token", async () => {
    const res = await request(app)
      .put("/users/account/username")
      .send({ newUsername: "john2" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized, token not available");
  });
  it("test update username - bad auth token", async () => {
    const res = await request(app)
      .put("/users/account/username")
      .set("Authorization", "hi")
      .send({ newUsername: "john2" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized");
  });
  it("test update username", async () => {
    const res = await request(app)
      .put("/users/account/username")
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
    const res = await request(app).put("/users/account/password").send({
      newPassword: "password1",
    });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized, token not available");
  });
  it("test update password - bad auth token", async () => {
    const res = await request(app)
      .put("/users/account/password")
      .set("Authorization", "hi")
      .send({
        newPassword: "password1",
      });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized");
  });
  it("test update password", async () => {
    const res = await request(app)
      .put("/users/account/password")
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
    const res = await request(app).delete("/users");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized, token not available");
  });
  it("test user delete - bad auth token", async () => {
    const res = await request(app).delete("/users").set("Authorization", "hi");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized");
  });
  it("test user delete", async () => {
    const res = await request(app)
      .delete("/users")
      .set("Authorization", authTokens.john2);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully deleted");
  });
});

// // meals -------------------------------------------------------->
describe("test meal endpoints", () => {
  it("test meal create", async () => {
    const login = await request(app)
      .post("/login")
      .send({ username: "Test1", password: "password" });
    expect(login.status).toBe(200);
    authTokens.Test1 = "Bearer " + login.body.accessToken;
    const res = await request(app)
      .post("/meals/new")
      .set("Authorization", authTokens.Test1)
      .send({
        meal_name: "Test Meal",
        meal_photo: "",
        scheduled_at: new Date("August 17, 2024 03:24:00"),
        address: "100 Cherry Ln Brewster, NY 10000",
        location_coords: [200, 300],
        radius: 20,
        budget: [10, 30],
      });
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.meal_id).toBeTruthy();
    testMealId = res.body.meal_id;
  });

  it("test get meals by user id", async () => {
    const res = await request(app)
      .get("/meals")
      .set("Authorization", authTokens.Test1);
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.meals).toBeTruthy();
  });
  it("test get past meals by user id", async () => {
    const res = await request(app)
      .get("/meals")
      .query({ time: "past" })
      .set("Authorization", authTokens.Test1);
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.meals).toBeTruthy();
  });
  it("test get future meals by user id", async () => {
    const res = await request(app)
      .get("/meals")
      .query({ time: "future" })
      .set("Authorization", authTokens.Test1);
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.meals).toBeTruthy();
  });
  it("test get meal by id", async () => {
    const res = await request(app)
      .get(`/meals/${testMealId}`)
      .set("Authorization", authTokens.Test1);
    expect(res.status).toBe(200);
    expect(res.body.meal.meal_id).toBe(testMealId);
    expect(res.body.meal.location_coords).toEqual([200, 300]);
    expect(res.body.meal.meal_name).toBe("Test Meal");
    expect(res.body.meal.meal_photo).toBe("");
    expect(res.body.meal.scheduled_at).toBe("2024-08-17T07:24:00.000Z");
    expect(res.body.meal.address).toBe("100 Cherry Ln Brewster, NY 10000");
    expect(res.body.meal.radius).toBe(20);
    expect(res.body.meal.budget).toEqual([10, 30]);
    expect(res.body.meal.created_at).toBeTruthy();
  });

  it("test add members - add one", async () => {
    const res = await request(app)
      .post(`/meals/${testMealId}/members/new`)
      .set("Authorization", authTokens.Test1)
      .send({ users: ["bob96"] });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully added 1 new member");
  });
  it("test add members - add multiple", async () => {
    const res = await request(app)
      .post(`/meals/${testMealId}/members/new`)
      .set("Authorization", authTokens.Test1)
      .send({ users: ["ghostBoy97", "linda45"] });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully added 2 new members");
  });
  it("test add members - add some non-existent", async () => {
    const res = await request(app)
      .post(`/meals/${testMealId}/members/new`)
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
      .post(`/meals/${testMealId}/members/new`)
      .set("Authorization", authTokens.Test1)
      .send({ users: ["24602", "linda47"] });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Could not find users to add");
  });
  it("test add members - members already in meal", async () => {
    const res = await request(app)
      .post(`/meals/${testMealId}/members/new`)
      .set("Authorization", authTokens.Test1)
      .send({ users: ["24601", "linda45"] });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("All users already in meal");
  });
  it("test list meal members", async () => {
    const res = await request(app)
      .get(`/meals/${testMealId}/members`)
      .set("Authorization", authTokens.Test1);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.members)).toBeTruthy();
    expect(res.body.members.length).toBe(5);
  });

  it("test meal search", async () => {
    const res = await request(app)
      .post("/meals/search")
      .set("Authorization", authTokens.Test1)
      .send({ queryTerm: "o" });
    console.log(res.body);
    expect(res.status).toBe(200);
  });
  it("test delete member from meal", async () => {
    const res = await request(app)
      .delete(`/meals/${testMealId}/members/4`)
      .set("Authorization", authTokens.Test1);
    expect(res.status).toBe(200);
  });

  it("test update meal data", async () => {
    const res = await request(app)
      .put(`/meals/${testMealId}`)
      .set("Authorization", authTokens.Test1)
      .send({
        meal_name: "Test Meal",
        meal_photo: "",
        scheduled_at: new Date("August 17, 2024 03:24:00"),
        address: "100 Cherry Ln Brewster, NY 10000",
        location_coords: [100, 100],
        radius: 20,
        budget: [10, 30],
        rating: 3.5,
      });
    expect(res.status).toBe(200);
    expect(res.body.location_coords).toEqual([100, 100]);
  });
  it("test update meal data - user not in meal", async () => {
    const res = await request(app)
      .put(`/meals/${testMealId}`)
      .set("Authorization", authTokens.john)
      .send({
        meal_name: "Test Meal",
        meal_photo: "",
        scheduled_at: new Date("August 17, 2024 03:24:00"),
        address: "100 Cherry Ln Brewster, NY 10000",
        location_coords: [50, 50],
        radius: 20,
        budget: [10, 30],
        rating: 3.5,
      });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized, user not in meal");
  });
  it("test update meal data - bad token", async () => {
    const res = await request(app)
      .put(`/meals/${testMealId}`)
      .set("Authorization", "hi")
      .send({
        meal_name: "Test Meal",
        meal_photo: "",
        scheduled_at: new Date("August 17, 2024 03:24:00"),
        address: "100 Cherry Ln Brewster, NY 10000",
        location_coords: [50, 50],
        radius: 20,
        budget: [10, 30],
        rating: 3.5,
      });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized");
  });
  it("test update meal data - no token", async () => {
    const res = await request(app)
      .put(`/meals/${testMealId}`)
      .send({
        meal_name: "Test Meal",
        meal_photo: "",
        scheduled_at: new Date("August 17, 2024 03:24:00"),
        address: "100 Cherry Ln Brewster, NY 10000",
        location_coords: [50, 50],
        radius: 20,
        budget: [10, 30],
        rating: 3.5,
      });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Not authorized, token not available");
  });
  it("test like meal", async () => {
    const res = await request(app)
      .put(`/meals/${testMealId}`)
      .send({
        liked: 0,
      })
      .set("Authorization", authTokens.Test1);
    expect(res.status).toBe(200);
    expect(res.body.liked).toBe(false);
  });
  it("test update meal chosen restaurant", async () => {
    const res = await request(app)
      .put(`/meals/${testMealId}`)
      .set("Authorization", authTokens.Test1)
      .send({ restaurant: "aRestaurantId" });
    expect(res.status).toBe(200);
    expect(res.body.chosen_restaurant).toBe("aRestaurantId");
  });
  it("test delete meal", async () => {
    const res = await request(app)
      .delete(`/meals/${testMealId}`)
      .set("Authorization", authTokens.Test1);
    expect(res.status).toBe(200);
  });
});

// restaurants ------------------------------------------------>
describe("test meal restaurants", () => {
  it("test get restaurants", async () => {
    const res = await request(app)
      .get("/meals/27/restaurants")
      .set("Authorization", authTokens.Test1);
    console.log(res.body);
    expect(res.status).toBe(200);
  });
  it("test add restaurant - insufficient data", async () => {
    const res = await request(app)
      .post("/meals/27/restaurants")
      .set("Authorization", authTokens.Test1)
      .send({ place_id: "resM" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Missing restaurant data");
  });
  it("test add restaurant - like", async () => {
    const res = await request(app)
      .post("/meals/27/restaurants")
      .query({ approved: 1 })
      .set("Authorization", authTokens.Test1)
      .send({ place_id: "resM" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully added");
    expect(res.body.liked).toBeTruthy();
  });
  it("test add restaurant - already exists", async () => {
    const res = await request(app)
      .post("/meals/27/restaurants")
      .query({ approved: 0 })
      .set("Authorization", authTokens.Test1)
      .send({ place_id: "resM" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Restaurant already exists");
  });
  it("test delete restaurant", async () => {
    const res = await request(app)
      .delete("/meals/27/restaurants/resM")
      .set("Authorization", authTokens.Test1);

    expect(res.status).toBe(200);
  });
  it("test add restaurant - dislike", async () => {
    const res = await request(app)
      .post("/meals/27/restaurants")
      .query({ approved: 0 })
      .set("Authorization", authTokens.Test1)
      .send({ place_id: "resM" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully added");
    expect(res.body.liked).not.toBeTruthy();
  });
  it("test update restaurant", async () => {
    const res = await request(app)
      .put("/meals/27/restaurants")
      .query({ approved: 1 })
      .set("Authorization", authTokens.Test1)
      .send({ place_id: "resM" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully updated");
    expect(res.body.liked).toBeTruthy();
  });
});

// PREFERENCES ENDPOINTS ============================================>
describe("test preferences endpoints", () => {
  it("test get preferences", async () => {
    const res = await request(app)
      .get("/meals/27/preferences")
      .set("Authorization", authTokens.Test1);
    expect(res.status).toBe(200);
    expect(res.body.preferences).toBeTruthy();
    expect(res.body.preferences.length).toBe(4);
  });
  it("test get preferences - wanted", async () => {
    const res = await request(app)
      .get("/meals/27/preferences")
      .query({ wanted: 1 })
      .set("Authorization", authTokens.Test1);
    expect(res.status).toBe(200);
    expect(res.body.preferences).toBeTruthy();
    expect(res.body.preferences.length).toBe(2);
  });
  it("test get preferences - not wanted", async () => {
    const res = await request(app)
      .get("/meals/27/preferences")
      .query({ wanted: 0 })
      .set("Authorization", authTokens.Test1);
    expect(res.status).toBe(200);
    expect(res.body.preferences).toBeTruthy();
    expect(res.body.preferences.length).toBe(2);
  });
  it("test update preferences - no deletion", async () => {
    const res = await request(app)
      .post("/meals/27/preferences")
      .set("Authorization", authTokens.Test1)
      .send({
        toAdd: ["thai_restaurant"],
        toDelete: [],
      })
      .query({ wanted: 1 });
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully updated preferences");
    let list = await request(app)
      .get("/meals/27/preferences")
      .query({ wanted: 1 })
      .set("Authorization", authTokens.Test1);
    expect(list.body.preferences.length).toBe(3);
  });
  it("test update preferences", async () => {
    const res = await request(app)
      .post("/meals/27/preferences")
      .set("Authorization", authTokens.Test1)
      .send({
        toAdd: ["pizza_restaurant"],
        toDelete: ["thai_restaurant"],
      })
      .query({ wanted: 1 });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully updated preferences");
    let list = await request(app)
      .get("/meals/27/preferences")
      .query({ wanted: 1 })
      .set("Authorization", authTokens.Test1);
    console.log(list.body);
    expect(list.body.preferences.length).toBe(3);
  });
  it("test update preferences - preexisting tag", async () => {
    const res = await request(app)
      .post("/meals/27/preferences")
      .set("Authorization", authTokens.Test1)
      .send({
        toAdd: ["pizza_restaurant"],
        toDelete: [],
      })
      .query({ wanted: 1 });
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Already up to date");
    let list = await request(app)
      .get("/meals/27/preferences")
      .query({ wanted: 1 })
      .set("Authorization", authTokens.Test1);
    expect(list.body.preferences.length).toBe(3);
  });
});

// // GOOGLE ENDPOINTS =================================================>
// describe("test google endpoints", () => {
//   it("test sample data", async () => {
//     const res = await request(app)
//       .get("/restaurants/test")
//       .set("Authorization", authTokens.Test1);
//     // console.log(res.body.results);
//     expect(res.status).toBe(200);
//   });
//   // it("test nearby search", async () => {
//   //   const res = await request(app).get("/restaurants");
//   //   expect(res.status).toBe(200);
//   //   expect(res.body.message).toBe("this is working");
//   // });
// });

// // describe("test auth middleware", () => {
// //   it("test create auth token", async () => {
// //     const res = await request(app)
// //       .post("/auth")
// //       .send({ username: "Test2", password: "password" });
// //     expect(res.status).toBe(200);
// //     expect(res.body.accessToken).toBeTruthy();
// //     expect(res.body.refreshToken).toBeTruthy();
// //   });
// //   it("test verify access token", async () => {
// //     const res = await request(app)
// //       .post("/auth")
// //       .send({ username: "Test3", password: "password" });
// //     expect(res.status).toBe(200);
// //     const ver = await request(app)
// //       .post("/verify")
// //       .set("authorization", res.body.accessToken);
// //     console.log(ver.body.message);
// //     expect(ver.status).toBe(200);
// //     expect(ver.body.message).toBe("Authorized user 8 - Test3");
// //   });
// //   it("test refresh token", async () => {
// //     const res = await request(app)
// //       .post("/auth")
// //       .send({ username: "Test4", password: "password" });
// //     expect(res.status).toBe(200);
// //     const ver = await request(app)
// //       .post("/refresh")
// //       .set("authorization", res.body.refreshToken);
// //     expect(ver.status).toBe(200);
// //     expect(ver.body.accessToken).toBeTruthy();
// //   });
// // });
