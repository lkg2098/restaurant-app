import { Sequelize, DataTypes } from "sequelize";
import db from "../config/database.js";
import GuestRestaurant from "./guest_restaurants.js";

const MealRestaurant = db.define("meal_restaurant", {
  restaurant_id: { type: DataTypes.INTEGER, allowNull: false },
  meal_id: { type: DataTypes.INTEGER, allowNull: false },
  in_budget: { type: DataTypes.BOOLEAN, allowNull: true },
  is_open: { type: DataTypes.BOOLEAN, allowNull: true },
});

MealRestaurant.prototype.getIsVetoed = async function () {
  const vetoedRestaurant = await GuestRestaurant.findOne({
    where: { meal_restaurant_id: this.id, vetoed: "t" },
  });

  return !!vetoedRestaurant;
};

export default MealRestaurant;
