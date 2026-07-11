import * as factories from "../../models/factories/index.js";
import { expect } from "chai";
import moment from "moment/moment.js";

import { createAuthenticatedTestServer } from "./utils/authenticatedRequest.js";
import truncate from "./utils/truncate.js";

describe("Meals Controller", () => {
  const setUpTest = async () => {
    const pastMeal = await factories.meal({
      scheduled_at: moment().subtract(2, "hours").toDate(),
    });

    const futureMeal = await factories.meal({
      scheduled_at: moment().add(1, "day").toDate(),
    });

    const user = await factories.user({
      username: "Test1",
      password: "password",
    });

    await factories.guest({
      user_id: user.id,
      meal_id: pastMeal.id,
      role: "admin",
    });

    await factories.guest({
      user_id: user.id,
      meal_id: futureMeal.id,
      role: "admin",
    });

    const authenticatedServer = createAuthenticatedTestServer({ user });

    return { pastMeal, futureMeal, user, authenticatedServer };
  };

  afterEach(async () => {
    await truncate();
  });

  describe("meals_list_by_user_id", () => {
    it("returns the meal data", async () => {
      const { pastMeal, authenticatedServer } = await setUpTest();

      const res = await authenticatedServer.get("/meals");
      authenticatedServer.app.closeServer();
      expect(res.body.meals[0]).to.eql({
        meal_name: pastMeal.meal_name,
        scheduled_at: pastMeal.scheduled_at.toISOString(),
        location_id: pastMeal.location_id,
        latitude: pastMeal.latitude,
        longitude: pastMeal.longitude,
        radius: pastMeal.radius,
        budget: pastMeal.budget,
        chosen_restaurant: null,
        guests: [],
      });
    });
    it("only returns meals associated with the user", async () => {
      const { authenticatedServer } = await setUpTest();

      const res = await authenticatedServer.get("/meals");

      expect(res.body.meals.length).to.eql(2);
    });
    it("only returns the guests that are not the requesting user", async () => {
      const { pastMeal, user, authenticatedServer } = await setUpTest();

      const user2 = await factories.user({});
      await factories.guest({ user_id: user2.id, meal_id: pastMeal.id });

      const res = await authenticatedServer.get("/meals");
      const { guests } = res.body.meals[0];
      expect(guests.length).to.eql(1);
      expect(guests.filter((guest) => guest !== user.name).length).to.eql(
        guests.length,
      );
    });
    describe("when time is not defined", () => {
      it("returns all meals associated with the user", async () => {
        const { authenticatedServer } = await setUpTest();

        const res = await authenticatedServer.get("/meals");

        expect(res.body.meals.length).to.eql(2);
      });
    });
    describe("when time is past", () => {
      it("returns only the past meals", async () => {
        const { authenticatedServer } = await setUpTest();

        const res = await authenticatedServer.get("/meals", { time: "past" });

        expect(res.body.meals.length).to.eql(1);
      });
    });
    describe("when time is future", () => {
      it("returns only the future meals", async () => {
        const { authenticatedServer } = await setUpTest();

        const res = await authenticatedServer.get("/meals", { time: "future" });

        expect(res.body.meals.length).to.eql(1);
      });
    });
  });
});
