import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {modeType} from "../App.tsx";

export const EDIT_MODE_SLICE_NAME = "editMode";


const initialState: modeType = {
  text: "Aa",
  fontSize: 30,
};

const editModeSlice = createSlice({
  name: EDIT_MODE_SLICE_NAME,
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<modeType>) => {
      Object.assign(state, action.payload);
    },
    remove: (state) => {
      state.text = "削除";
    }
  }
});

export const {setMode, remove} = editModeSlice.actions;
export default editModeSlice.reducer;