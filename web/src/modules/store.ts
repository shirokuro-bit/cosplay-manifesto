import {configureStore} from "@reduxjs/toolkit";

import imageItemsSlice from "./imageItemsSlice.ts";
import selectIdSlice from "./selectIdSlice.ts";
import editModeSlice from "./editModeSlice.ts";
import effectTextSlice from "./effectTextSlice.ts";

export const store = configureStore({
  reducer: {
    imageItems: imageItemsSlice,
    selectId: selectIdSlice,
    editMode: editModeSlice,
    effectText: effectTextSlice
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false
  })
});

export type RootState = ReturnType<typeof store.getState>