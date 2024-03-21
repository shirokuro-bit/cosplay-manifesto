import {configureStore} from "@reduxjs/toolkit";

import imageItemsSlice from "./imageItemsSlice.ts";
import selectIdSlice from "./selectIdSlice.ts";

export const store = configureStore({
  reducer: {
    imageItems: imageItemsSlice,
    selectId: selectIdSlice
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false
  })
});

export type RootState = ReturnType<typeof store.getState>