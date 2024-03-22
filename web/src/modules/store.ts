import {configureStore} from "@reduxjs/toolkit";

import imageItemsSlice from "./imageItemsSlice.ts";
import selectIdSlice from "./selectIdSlice.ts";
import editModeSlice from "./editModeSlice.ts";

export const store = configureStore({
  reducer: {
    imageItems: imageItemsSlice,
    selectId: selectIdSlice,
    editMode: editModeSlice
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false
  })
});

export type RootState = ReturnType<typeof store.getState>