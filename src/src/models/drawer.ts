import { createModel } from "@rematch/core";
import { RootModel } from ".";

export const drawer = createModel<RootModel>()({
  state: { open: false }, // initial state (closed)
  reducers: {
    setOpen(state, payload: boolean) {
      return { open: payload };
    },
  },
});
