import { Models } from "@rematch/core";
import { count } from "./count";
import { errors } from "./errors";
import { prices } from "./prices";
import { drawer } from "./drawer";
import { user } from "./user";

export interface RootModel extends Models<RootModel> {
  count: typeof count;
  errors: typeof errors;
  prices: typeof prices;
  drawer: typeof drawer;
  user: typeof user;
}
export const models: RootModel = { count, errors, prices, drawer, user };
