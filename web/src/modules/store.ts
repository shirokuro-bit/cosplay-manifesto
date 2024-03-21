import imageItemsSlice from "./imageItemsSlice.ts";
import {configureStore} from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    imageItems: imageItemsSlice
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false
  })
});

export type RootState = ReturnType<typeof store.getState>