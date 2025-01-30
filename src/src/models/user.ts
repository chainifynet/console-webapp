import { createModel } from "@rematch/core";
import { RootModel } from ".";
import { CurrentUser, UserResponse } from "../../types/types";
import * as userApi from "../lib/api/user";

export const user = createModel<RootModel>()({
  state: <CurrentUser | null>null, // initial state
  reducers: {
    // handle state changes with pure functions
    set(state, payload: CurrentUser | null = null) {
      return payload;
    },

    updateUser(state, payload: Partial<UserResponse>) {
      if (!state?.user) {
        return state;
      }
      return {
        ...state,
        user: {
          ...state.user,
          ...payload,
        },
      };
    },
  },
  effects: (dispatch) => ({
    // handle state changes with impure functions.
    // use async/await for async actions
    async fetchCurrentUser(token: string) {
      const u = await userApi.getCurrentUser(token);
      dispatch.user.set(u);
    },
  }),
});
