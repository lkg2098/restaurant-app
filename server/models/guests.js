import { Sequelize, DataTypes } from "sequelize";
import db from "../config/database.js";

const Guest = db.define("guest", {
  meal_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isIn: [["admin", "guest"]] },
  },
  round: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0, max: 2 },
  },
  likedMeal: { type: DataTypes.BOOLEAN, allowNull: true },
});

export default Guest;
