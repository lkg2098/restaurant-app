import truncate from "../../controllers/test/utils/truncate.js";
import * as factories from "../factories/index.js";
import GuestRestaurant from "../guest_restaurants.js";
import { meal_get_by_id } from "../meals.js";
import { expect } from "chai";

describe("Meal", () => {
  afterEach(async () => {
    await truncate();
  });
  describe("meal_get_by_id", () => {
    it("gets the meal", async () => {
      const meal = await factories.meal({});
      const adminUser = await factories.user({});
      const guestUser = await factories.user({});
      const admin = await factories.guest({
        meal_id: meal.id,
        user_id: adminUser.id,
        role: "admin",
      });
      const guest = await factories.guest({
        meal_id: meal.id,
        user_id: guestUser.id,
        role: "guest",
      });

      const result = await meal_get_by_id(meal.id, admin.id);

      console.log(result);
    });
  });
  describe("meal_unseen_restaurant_count", () => {
    const setUpTest = async () => {
      const meal = await factories.meal({});
      const adminUser = await factories.user({});

      const admin = await factories.guest({
        meal_id: meal.id,
        user_id: adminUser.id,
        role: "admin",
      });

      for (let i = 0; i < 10; i++) {
        const mealRestaurant = await factories.mealRestaurant({
          meal_id: meal.id,
        });

        await factories.guestRestaurant({
          meal_restaurant_id: mealRestaurant.id,
          guest_id: admin.id,
        });
      }

      const guestRestaurant = await GuestRestaurant.findOne({
        where: { guest_id: admin.id },
      });

      return { admin, meal, guestRestaurant };
    };
    describe("happy path", () => {
      it("counts the unseen restaurants", async () => {
        const { admin, meal } = await setUpTest();

        const result = await meal.getUnseenRestaurantCountByGuestId(admin.id);
        expect(result).to.eql(10);
      });
    });
    describe("when meal_restaurant exists but guest_restaurant does not", () => {
      it("counts the restaurant", async () => {
        const { admin, meal } = await setUpTest();

        await factories.mealRestaurant({
          meal_id: meal.id,
        });

        const result = await meal.getUnseenRestaurantCountByGuestId(admin.id);
        expect(result).to.eql(11);
      });
    });
    describe("when a restaurant is vetoed by any guest", () => {
      it("does not count it", async () => {
        const { admin, meal, guestRestaurant } = await setUpTest();

        const guestUser = await factories.user({});
        const guest = await factories.guest({
          meal_id: meal.id,
          user_id: guestUser.id,
          role: "guest",
        });

        await factories.guestRestaurant({
          meal_restaurant_id: guestRestaurant.meal_restaurant_id,
          guest_id: guest.id,
          vetoed: true,
        });

        const result = await meal.getUnseenRestaurantCountByGuestId(admin.id);

        expect(result).to.eql(9);
      });
    });
    describe("when the guest has approved the restaurant", () => {
      it("does not count it", async () => {
        const { meal, admin, guestRestaurant } = await setUpTest();

        await guestRestaurant.update({
          approved: true,
        });

        const result = await meal.getUnseenRestaurantCountByGuestId(admin.id);

        expect(result).to.eql(9);
      });
    });
    describe("when the guest has disapproved the restaurant", () => {
      it("does not count it", async () => {
        const { meal, admin, guestRestaurant } = await setUpTest();

        await guestRestaurant.update({
          approved: false,
        });

        const result = await meal.getUnseenRestaurantCountByGuestId(admin.id);

        expect(result).to.eql(9);
      });
    });
    describe("when the restaurant is hidden from the guest", () => {
      it("does not count it", async () => {
        const { meal, admin, guestRestaurant } = await setUpTest();

        await guestRestaurant.update({
          hidden_from_user: true,
        });

        const result = await meal.getUnseenRestaurantCountByGuestId(admin.id);

        expect(result).to.eql(9);
      });
    });
  });
});
