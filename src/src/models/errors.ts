import { createModel } from "@rematch/core";
import { RootModel } from ".";

export const errors = createModel<RootModel>()({
  state: <string[]>[], // initial state
  reducers: {
    /**
     * Sets one error message discarding all others
     */
    set(state, errorMessage: string) {
      return [errorMessage];
    },

    /**
     * Adds one error message to the list or errors
     */
    add(state, errorMessage: string) {
      return [...state, errorMessage];
    },

    /**
     * Clear all error messages
     */
    clear(state) {
      return [];
    },
  },
});
