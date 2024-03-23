import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {imageItemType} from "../App.tsx";

export const IMAGE_ITEMS_SLICE_NAME = "imageItems";

const initialState: imageItemType[] = [];

const imageItemsSlice = createSlice({
  name: IMAGE_ITEMS_SLICE_NAME,
  initialState,
  reducers: {
    add: (state, action) => {
      state.push(action.payload);
    },
    replace: (state, action: PayloadAction<imageItemType[]>) => {
      Object.assign(state, action.payload);
    }
  }
});

export const {add, replace} = imageItemsSlice.actions;
export default imageItemsSlice.reducer;