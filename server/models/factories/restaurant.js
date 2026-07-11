import { faker } from "@faker-js/faker";
import Restaurant from "../restaurants.js";

export async function restaurant() {
  return await Restaurant.create({ place_id: faker.string.uuid() });
}
