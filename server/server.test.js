const request = require("supertest");
const app = require("./server");
const bcrypt = require("bcrypt");

const pool = require("./pool");
const { password } = require("pg/lib/defaults");

afterAll(async () => {
  await pool.clearTestData();
  pool.end();
  app.closeServer();
});

const authTokens = { john: "a", john2: "b", johnRefresh: "r" };
const userData = { john: { id: "a" } };
let testMealId = 1;

describe("test index endpoints", () => {
  it("test signup", async () => {
    const res = await request(app).post("/signup").send({
      username: "john",
      password: "maybe45",
      phone_number: "19123984506",
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Registered successfully");
    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.refreshToken).toBeTruthy();
    userData.john.id = res.body.userId;
    const newUser = await request(app).get("/users/john");
    expect(newUser.body.user.username).toBe("john");
    expect(bcrypt.compare("maybe45", newUser.body.user.password)).toBeTruthy();
  });
  it("test signup with existing username", async () => {
    const res = await request(app).post("/signup").send({
      username: "john",
      password: "12345",
      phone_number: "19123984508",
    });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("This username is taken");
  });
  it("test signup with existing phone number", async () => {
    const res = await request(app).post("/signup").send({
      username: "milly",
      password: "12345",
      phone_number: "19123984506",
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
    expect(res.body.users.length >= 8).toBeTruthy();
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
    expect(res.body.users.length >= 1).toBeTruthy();
  });
  it("test query usernames - no matching usenames", async () => {
    const res = await request(app)
      .post("/users/search")
      .set("Authorization", authTokens.john)
      .send({ queryTerm: "111!" });
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
  // it("test update password - no auth token", async () => {
  //   const res = await request(app).put("/users/account/password").send({
  //     newPassword: "password1",
  //   });
  //   expect(res.status).toBe(401);
  //   expect(res.body.error).toBe("Not authorized, token not available");
  // });
  // it("test update password - bad auth token", async () => {
  //   const res = await request(app)
  //     .put("/users/account/password")
  //     .set("Authorization", "hi")
  //     .send({
  //       newPassword: "password1",
  //     });
  //   expect(res.status).toBe(401);
  //   expect(res.body.error).toBe("Not authorized");
  // });
  // it("test update password", async () => {
  //   const res = await request(app)
  //     .put("/users/account/password")
  //     .set("Authorization", authTokens.john2)
  //     .send({
  //       newPassword: "password1",
  //     });
  //   expect(res.status).toBe(200);
  //   const updated = await request(app)
  //     .get("/users/account")
  //     .set("Authorization", authTokens.john2);
  //   expect(
  //     bcrypt.compare("password1", updated.body.user.password)
  //   ).toBeTruthy();
  // });
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
  // it("test user delete", async () => {
  //   const res = await request(app)
  //     .delete("/users")
  //     .set("Authorization", authTokens.john2);
  //   expect(res.status).toBe(200);
  //   expect(res.body.message).toBe("Successfully deleted");
  // });
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
        location_id: "100 Cherry Ln Brewster, NY 10000",
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
    expect(res.body.meal.location_id).toBe("100 Cherry Ln Brewster, NY 10000");
    expect(res.body.meal.radius).toBe(20);
    expect(res.body.meal.budget).toEqual([10, 30]);
    expect(res.body.meal.created_at).toBeTruthy();
  });

  it("test add member - already in meal", async () => {
    console.log(userData.john.id);
    const res = await request(app)
      .post(`/meals/27/members/new`)
      .set("Authorization", authTokens.Test1)
      .send({ user_id: 2, role: "guest" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Member already in meal");
  });
  it("test add member - test meal", async () => {
    console.log(userData.john.id);
    const res = await request(app)
      .post(`/meals/${testMealId}/members/new`)
      .set("Authorization", authTokens.Test1)
      .send({ user_id: 2, role: "guest" });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully added member");
  });
  it("test add member", async () => {
    const res = await request(app)
      .post(`/meals/27/members/new`)
      .set("Authorization", authTokens.Test1)
      .send({ user_id: userData.john.id, role: "guest" });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully added member");
  });
  it("test list meal members", async () => {
    const res = await request(app)
      .get(`/meals/${testMealId}/members`)
      .set("Authorization", authTokens.Test1);
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.members)).toBeTruthy();
    expect(res.body.members.length).toBe(1);
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
        location_id: "100 Cherry Ln Brewster, NY 10000",
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
        location_id: "100 Cherry Ln Brewster, NY 10000",
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
        location_id: "100 Cherry Ln Brewster, NY 10000",
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
        location_id: "100 Cherry Ln Brewster, NY 10000",
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
      .send({ chosen_restaurant: "aRestaurantId" });
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

// PREFERENCES ENDPOINTS ============================================>
describe("test preferences endpoints", () => {
  it("test add preferences", async () => {
    const res = await request(app)
      .post("/meals/27/preferences")
      .send({
        preferences: [
          "american_restaurant",
          "pizza_restaurant",
          "lebanese_restaurant",
        ],
        google_data_string: `values('ChIJ3z_bIK6SwokRz3XMu8xCPI8', 4.3,'{"breakfast_restaurant"}'),
        ('ChIJv0CFoxKTwokR4Sfgcmab1EI', 4.6,'{}'),
        ('ChIJ23paVWmTwokRd0rp8kdKM0w', 4.8,'{}'),
        ('ChIJK0BTQK6SwokRN5bYvABnbvU', 4,'{"coffee_shop","cafe","breakfast_restaurant"}'),
        ('ChIJfxSm1EyTwokRYGIgYm3dqls', 4.3,'{"brunch_restaurant"}'),
        ('ChIJxxDLVlGNwokRPgtjAbxyevY', 4.3,'{"american_restaurant","bar"}'),
        ('ChIJJZ99iq2SwokRkbZKRzJeoio', 4.6,'{"italian_restaurant"}'),
        ('ChIJ3dQdIsCSwokRs0eyh6JtnNU', 4.5,'{"italian_restaurant","pizza_restaurant","bar"}'),
        ('ChIJDYixUwKTwokRPRmLS0smLjY', 4.6,'{"bar"}'),
        ('ChIJu0cRRTKTwokRfNplZS8Lbjc', 4.4,'{"italian_restaurant"}'),
        ('ChIJBzAI6pKTwokRquXPFwGcFOA', 4.4,'{}'),
        ('ChIJE4lzm8eSwokRiN93djbk0Ig', 4.1,'{"coffee_shop","cafe","breakfast_restaurant"}'),
        ('ChIJG3TgE66SwokRX0scyzq-V6o', 4.4,'{"american_restaurant"}'),
        ('ChIJl4RjnqeTwokRgvrQWgt9EmY', 4.4,'{"american_restaurant"}'),
        ('ChIJN78jnMeSwokRpT5Sq_QGD58', 4.4,'{"indian_restaurant","bar"}'),
        ('ChIJqyTM-MeSwokRwtBPDSglPUg', 4.5,'{"italian_restaurant"}'),
        ('ChIJiUIlT3mTwokRrJDV5pZnTMs', 4.4,'{"pizza_restaurant","fast_food_restaurant"}'),
        ('ChIJ0aowaK6SwokRL-HTR_foN38', 4.4,'{"bar"}'),
        ('ChIJH-lolKzywokRCvohk-BdCT0', 3.8,'{"coffee_shop","cafe","fast_food_restaurant","breakfast_restaurant"}'),
        ('ChIJZReJaq6SwokRbZGfHBROUZU', 4.2,'{"bar","american_restaurant"}')`,
      })
      .set("Authorization", authTokens.Test1);
    expect(res.status).toBe(200);
  });
  it("test add preferences", async () => {
    const res = await request(app)
      .post("/meals/27/preferences")
      .send({
        preferences: [
          "indian_restaurant",
          "pizza_restaurant",
          "italian_restaurant",
        ],
        google_data_string: `values('ChIJ3z_bIK6SwokRz3XMu8xCPI8', 4.3,'{"breakfast_restaurant"}'),
        ('ChIJv0CFoxKTwokR4Sfgcmab1EI', 4.6,'{}'),
        ('ChIJ23paVWmTwokRd0rp8kdKM0w', 4.8,'{}'),
        ('ChIJK0BTQK6SwokRN5bYvABnbvU', 4,'{"coffee_shop","cafe","breakfast_restaurant"}'),
        ('ChIJfxSm1EyTwokRYGIgYm3dqls', 4.3,'{"brunch_restaurant"}'),
        ('ChIJxxDLVlGNwokRPgtjAbxyevY', 4.3,'{"american_restaurant","bar"}'),
        ('ChIJJZ99iq2SwokRkbZKRzJeoio', 4.6,'{"italian_restaurant"}'),
        ('ChIJ3dQdIsCSwokRs0eyh6JtnNU', 4.5,'{"italian_restaurant","pizza_restaurant","bar"}'),
        ('ChIJDYixUwKTwokRPRmLS0smLjY', 4.6,'{"bar"}'),
        ('ChIJu0cRRTKTwokRfNplZS8Lbjc', 4.4,'{"italian_restaurant"}'),
        ('ChIJBzAI6pKTwokRquXPFwGcFOA', 4.4,'{}'),
        ('ChIJE4lzm8eSwokRiN93djbk0Ig', 4.1,'{"coffee_shop","cafe","breakfast_restaurant"}'),
        ('ChIJG3TgE66SwokRX0scyzq-V6o', 4.4,'{"american_restaurant"}'),
        ('ChIJl4RjnqeTwokRgvrQWgt9EmY', 4.4,'{"american_restaurant"}'),
        ('ChIJN78jnMeSwokRpT5Sq_QGD58', 4.4,'{"indian_restaurant","bar"}'),
        ('ChIJqyTM-MeSwokRwtBPDSglPUg', 4.5,'{"italian_restaurant"}'),
        ('ChIJiUIlT3mTwokRrJDV5pZnTMs', 4.4,'{"pizza_restaurant","fast_food_restaurant"}'),
        ('ChIJ0aowaK6SwokRL-HTR_foN38', 4.4,'{"bar"}'),
        ('ChIJH-lolKzywokRCvohk-BdCT0', 3.8,'{"coffee_shop","cafe","fast_food_restaurant","breakfast_restaurant"}'),
        ('ChIJZReJaq6SwokRbZGfHBROUZU', 4.2,'{"bar","american_restaurant"}')`,
      })
      .set("Authorization", authTokens.john2);
    expect(res.status).toBe(200);
  });
  it("test get preference tags", async () => {
    const res = await request(app)
      .get("/meals/27/preferences")
      .query({ setting: "unwantedCuisines" })
      .set("Authorization", authTokens.Test1);
    expect(res.status).toBe(200);
    expect(res.body.preferences).toBeTruthy();
    expect(res.body.preferences.length).toBe(3);
  });
  // it("test get preferences - wanted", async () => {
  //   const res = await request(app)
  //     .get("/meals/27/preferences")
  //     .query({ wanted: 1 })
  //     .set("Authorization", authTokens.Test1);
  //   expect(res.status).toBe(200);
  //   expect(res.body.preferences).toBeTruthy();
  //   expect(res.body.preferences.length).toBe(2);
  // });
  // it("test get preferences - not wanted", async () => {
  //   const res = await request(app)
  //     .get("/meals/27/preferences")
  //     .query({ wanted: 0 })
  //     .set("Authorization", authTokens.Test1);
  //   expect(res.status).toBe(200);
  //   expect(res.body.preferences).toBeTruthy();
  //   expect(res.body.preferences.length).toBe(2);
  // });
  it("test get min rating", async () => {
    const res = await request(app)
      .get("/meals/27/preferences")
      .query({ setting: "rating" })
      .set("Authorization", authTokens.Test1);
    expect(res.status).toBe(200);
    expect(res.body.rating).toBeTruthy();
    expect(res.body.rating).toBe(4.5);
  });
  it("test get all settings", async () => {
    const res = await request(app)
      .get("/meals/27/preferences")
      .query({ setting: "all" })
      .set("Authorization", authTokens.Test1);
    expect(res.status).toBe(200);
    expect(res.body.settings).toBeTruthy();
    expect(res.body.settings.rating).toBeTruthy();
    expect(res.body.settings.rating).toBe(4.5);
    expect(res.body.settings.preferences).toBeTruthy();
    expect(res.body.settings.preferences.length).toBe(3);
  });
  it("test update preference tags", async () => {
    const res = await request(app)
      .put("/meals/27/preferences")
      .set("Authorization", authTokens.Test1)
      .send({
        preferences: [
          "american_restaurant",
          "chinese_restaurant",
          "lebanese_restaurant",
        ],
        google_data_string: `values('ChIJ3z_bIK6SwokRz3XMu8xCPI8', 4.3,'{"breakfast_restaurant"}'),
        ('ChIJv0CFoxKTwokR4Sfgcmab1EI', 4.6,'{}'),
        ('ChIJ23paVWmTwokRd0rp8kdKM0w', 4.8,'{}'),
        ('ChIJK0BTQK6SwokRN5bYvABnbvU', 4,'{"coffee_shop","cafe","breakfast_restaurant"}'),
        ('ChIJfxSm1EyTwokRYGIgYm3dqls', 4.3,'{"brunch_restaurant"}'),
        ('ChIJxxDLVlGNwokRPgtjAbxyevY', 4.3,'{"american_restaurant","bar"}'),
        ('ChIJJZ99iq2SwokRkbZKRzJeoio', 4.6,'{"italian_restaurant"}'),
        ('ChIJ3dQdIsCSwokRs0eyh6JtnNU', 4.5,'{"italian_restaurant","pizza_restaurant","bar"}'),
        ('ChIJDYixUwKTwokRPRmLS0smLjY', 4.6,'{"bar"}'),
        ('ChIJu0cRRTKTwokRfNplZS8Lbjc', 4.4,'{"italian_restaurant"}'),
        ('ChIJBzAI6pKTwokRquXPFwGcFOA', 4.4,'{}'),
        ('ChIJE4lzm8eSwokRiN93djbk0Ig', 4.1,'{"coffee_shop","cafe","breakfast_restaurant"}'),
        ('ChIJG3TgE66SwokRX0scyzq-V6o', 4.4,'{"american_restaurant"}'),
        ('ChIJl4RjnqeTwokRgvrQWgt9EmY', 4.4,'{"american_restaurant"}'),
        ('ChIJN78jnMeSwokRpT5Sq_QGD58', 4.4,'{"indian_restaurant","bar"}'),
        ('ChIJqyTM-MeSwokRwtBPDSglPUg', 4.5,'{"italian_restaurant"}'),
        ('ChIJiUIlT3mTwokRrJDV5pZnTMs', 4.4,'{"pizza_restaurant","fast_food_restaurant"}'),
        ('ChIJ0aowaK6SwokRL-HTR_foN38', 4.4,'{"bar"}'),
        ('ChIJH-lolKzywokRCvohk-BdCT0', 3.8,'{"coffee_shop","cafe","fast_food_restaurant","breakfast_restaurant"}'),
        ('ChIJZReJaq6SwokRbZGfHBROUZU', 4.2,'{"bar","american_restaurant"}')`,
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully updated preferences");
    console.log(res.body);
    let list = await request(app)
      .get("/meals/27/preferences")
      .query({ setting: "unwantedCuisines" })
      .set("Authorization", authTokens.Test1);

    expect(list.body.preferences.length).toBe(3);
  });
  it("test update min_rating", async () => {
    const res = await request(app)
      .put("/meals/27/preferences")
      .set("Authorization", authTokens.Test1)
      .send({
        min_rating: 3.5,
        google_data_string: `values('ChIJ3z_bIK6SwokRz3XMu8xCPI8', 4.3,'{"breakfast_restaurant"}'),
        ('ChIJv0CFoxKTwokR4Sfgcmab1EI', 4.6,'{}'),
        ('ChIJ23paVWmTwokRd0rp8kdKM0w', 4.8,'{}'),
        ('ChIJK0BTQK6SwokRN5bYvABnbvU', 4,'{"coffee_shop","cafe","breakfast_restaurant"}'),
        ('ChIJfxSm1EyTwokRYGIgYm3dqls', 4.3,'{"brunch_restaurant"}'),
        ('ChIJxxDLVlGNwokRPgtjAbxyevY', 4.3,'{"american_restaurant","bar"}'),
        ('ChIJJZ99iq2SwokRkbZKRzJeoio', 4.6,'{"italian_restaurant"}'),
        ('ChIJ3dQdIsCSwokRs0eyh6JtnNU', 4.5,'{"italian_restaurant","pizza_restaurant","bar"}'),
        ('ChIJDYixUwKTwokRPRmLS0smLjY', 4.6,'{"bar"}'),
        ('ChIJu0cRRTKTwokRfNplZS8Lbjc', 4.4,'{"italian_restaurant"}'),
        ('ChIJBzAI6pKTwokRquXPFwGcFOA', 4.4,'{}'),
        ('ChIJE4lzm8eSwokRiN93djbk0Ig', 4.1,'{"coffee_shop","cafe","breakfast_restaurant"}'),
        ('ChIJG3TgE66SwokRX0scyzq-V6o', 4.4,'{"american_restaurant"}'),
        ('ChIJl4RjnqeTwokRgvrQWgt9EmY', 4.4,'{"american_restaurant"}'),
        ('ChIJN78jnMeSwokRpT5Sq_QGD58', 4.4,'{"indian_restaurant","bar"}'),
        ('ChIJqyTM-MeSwokRwtBPDSglPUg', 4.5,'{"italian_restaurant"}'),
        ('ChIJiUIlT3mTwokRrJDV5pZnTMs', 4.4,'{"pizza_restaurant","fast_food_restaurant"}'),
        ('ChIJ0aowaK6SwokRL-HTR_foN38', 4.4,'{"bar"}'),
        ('ChIJH-lolKzywokRCvohk-BdCT0', 3.8,'{"coffee_shop","cafe","fast_food_restaurant","breakfast_restaurant"}'),
        ('ChIJZReJaq6SwokRbZGfHBROUZU', 4.2,'{"bar","american_restaurant"}')`,
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully updated preferences");
    let list = await request(app)
      .get("/meals/27/preferences")
      .query({ setting: "rating" })
      .set("Authorization", authTokens.Test1);

    expect(list.body.rating).toBe(3.5);
  });
});

// restaurants ------------------------------------------------>
describe("test meal restaurants", () => {
  it("test update restaurant - like", async () => {
    const res = await request(app)
      .put("/meals/27/restaurants")
      .send({ place_id: "ChIJl4RjnqeTwokRgvrQWgt9EmY", action: "like" })
      .set("Authorization", authTokens.Test1);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully updated");
    expect(res.body.liked).toBeTruthy();
  });
  it("test update restaurant - like", async () => {
    const res = await request(app)
      .put("/meals/27/restaurants")
      .send({ place_id: "ChIJxxDLVlGNwokRPgtjAbxyevY", action: "like" })
      .set("Authorization", authTokens.Test1);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully updated");
    expect(res.body.liked).toBeTruthy();
  });
  it("test update restaurant - dislike", async () => {
    const res = await request(app)
      .put("/meals/27/restaurants")
      .send({ place_id: "ChIJqyTM-MeSwokRwtBPDSglPUg", action: "dislike" })
      .set("Authorization", authTokens.Test1);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully updated");
    expect(res.body.liked).toBe(-1);
  });
  it("test update restaurant - dislike", async () => {
    const res = await request(app)
      .put("/meals/27/restaurants")
      .send({ place_id: "ChIJZReJaq6SwokRbZGfHBROUZU", action: "dislike" })
      .set("Authorization", authTokens.Test1);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Successfully updated");
    expect(res.body.liked).toBe(-1);
  });
  it("test get google data", async () => {
    const res = await request(app)
      .get("/meals/27/googleData")
      .set("Authorization", authTokens.john2);
    console.log(res.body);
    expect(res.status).toBe(200);
  });
  it("test get restaurant scores", async () => {
    const res = await request(app)
      .get("/meals/27/restaurants")
      .query({
        place_ids: [
          "ChIJv0CFoxKTwokR4Sfgcmab1EI",
          "ChIJ23paVWmTwokRd0rp8kdKM0w",
          "ChIJK0BTQK6SwokRN5bYvABnbvU",
          "ChIJfxSm1EyTwokRYGIgYm3dqls",
          "ChIJxxDLVlGNwokRPgtjAbxyevY",
          "ChIJJZ99iq2SwokRkbZKRzJeoio",
          "ChIJ3dQdIsCSwokRs0eyh6JtnNU",
          "ChIJDYixUwKTwokRPRmLS0smLjY",
          "ChIJu0cRRTKTwokRfNplZS8Lbjc",
          "ChIJBzAI6pKTwokRquXPFwGcFOA",
          "ChIJE4lzm8eSwokRiN93djbk0Ig",
          "ChIJG3TgE66SwokRX0scyzq-V6o",
          "ChIJl4RjnqeTwokRgvrQWgt9EmY",
          "ChIJN78jnMeSwokRpT5Sq_QGD58",
          "ChIJqyTM-MeSwokRwtBPDSglPUg",
          "ChIJiUIlT3mTwokRrJDV5pZnTMs",
          "ChIJ0aowaK6SwokRL-HTR_foN38",
          "ChIJH-lolKzywokRCvohk-BdCT0",
          "ChIJZReJaq6SwokRbZGfHBROUZU",
        ],
      })
      .set("Authorization", authTokens.john2);
    // console.log(res.body);
    expect(res.status).toBe(200);
  });
});
// it("test add restaurant - insufficient data", async () => {
//   const res = await request(app)
//     .post("/meals/27/restaurants")
//     .set("Authorization", authTokens.Test1)
//     .send({ place_id: "resM" });
//   expect(res.status).toBe(401);
//   expect(res.body.error).toBe("Missing restaurant data");
// });
// it("test add restaurant - like", async () => {
//   const res = await request(app)
//     .post("/meals/27/restaurants")
//     .query({ approved: 1 })
//     .set("Authorization", authTokens.Test1)
//     .send({ place_id: "resM" });

//   expect(res.status).toBe(200);
//   expect(res.body.message).toBe("Successfully added");
//   expect(res.body.liked).toBeTruthy();
// });
// it("test add restaurant - already exists", async () => {
//   const res = await request(app)
//     .post("/meals/27/restaurants")
//     .query({ approved: 0 })
//     .set("Authorization", authTokens.Test1)
//     .send({ place_id: "resM" });
//   expect(res.status).toBe(401);
//   expect(res.body.error).toBe("Restaurant already exists");
// });
// it("test delete restaurant", async () => {
//   const res = await request(app)
//     .delete("/meals/27/restaurants/resM")
//     .set("Authorization", authTokens.Test1);

//   expect(res.status).toBe(200);
// });
// it("test add restaurant - dislike", async () => {
//   const res = await request(app)
//     .post("/meals/27/restaurants")
//     .query({ approved: 0 })
//     .set("Authorization", authTokens.Test1)
//     .send({ place_id: "resM" });

//   expect(res.status).toBe(200);
//   expect(res.body.message).toBe("Successfully added");
//   expect(res.body.liked).not.toBeTruthy();
// });
//   it("test update restaurant", async () => {
//     const res = await request(app)
//       .put("/meals/27/restaurants")
//       .query({ approved: 1 })
//       .set("Authorization", authTokens.Test1)
//       .send({ place_id: "resM" });

//     expect(res.status).toBe(200);
//     expect(res.body.message).toBe("Successfully updated");
//     expect(res.body.liked).toBeTruthy();
//   });
// });

// GOOGLE ENDPOINTS =================================================>
describe("test google endpoints", () => {
  // it("test sample data", async () => {
  //   console.log("testing.....");
  //   const res = await request(app)
  //     .get("/meals/27/restaurants")
  //     .query({ location_id: "ChIJ-b2RmVlZwokRpb1pwEQjss0" })
  //     .set("Authorization", authTokens.Test1);
  //   // console.log(res.body.results);
  //   expect(res.status).toBe(200);
  // });
  // it("test get geocoded data", async () => {
  //   const res = await request(app)
  //     .get("/meals/test")
  //     .query({ coords: [40.939659194496, -73.83177411572733] })
  //     .set("Authorization", authTokens.Test1);
  //   expect(res.status).toBe(200);
  //   expect(res.body.address).toBe(
  //     "7 Tanglewylde Ave, Bronxville, NY 10708, USA"
  //   );
  // });
  // it("test get photo", async () => {
  //   const res = await request(app)
  //     .post("/restaurants/photo")
  //     .send({
  //       photo_name:
  //         "places/ChIJ3z_bIK6SwokRz3XMu8xCPI8/photos/AUc7tXWHlKEQKVYLSLjoS2YNtZ9ttjp3FP_Mnf-9VY-UX7OIHU_DDp9JCPJOL8oe2WE_p4dpN5Eh8EvdZr8ypx6uiRqZBxYeNodi6hAe3gkeOH5XqTbmkNGWs7pXqEQZzNksLwiUsJs2ViN0apqvkJhvA2pS--MfJcC65grX",
  //     })
  //     .set("Authorization", authTokens.Test1);
  //   expect(res.status).toBe(200);
  // });
  // it("test more results", async () => {
  //   const res = await request(app)
  //     .get("/restaurants/coords")
  //     .set("Authorization", authTokens.Test1);
  //   expect(res.status).toBe(200);
  // });
  // it("test nearby search", async () => {
  //   const res = await request(app).get("/restaurants");
  //   expect(res.status).toBe(200);
  //   expect(res.body.message).toBe("this is working");
  // });
});

// LOCATION GEOCODING ENDPOINTS ======================================>
// describe("test geocoding endpoints", () => {
//   it("test autocomplete", async () => {
//     const res = await request(app)
//       .get("/location")
//       .query({
//         text: "7 tanglewylde ave",
//         latitude: 40.93932186606071,
//         longitude: -73.83224618581667,
//       })
//       .set("Authorization", authTokens.Test1);
//     console.log(res.body.results);
//     expect(res.status).toBe(200);
//   });
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
