import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const EFFECT_TEXT_SLICE_NAME = "effectText";


const initialState: { text: string } = {text: ""};

const effectTextSlice = createSlice({
  name: EFFECT_TEXT_SLICE_NAME,
  initialState,
  reducers: {
    setTest: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
    },
  }
});

export const {setTest} = effectTextSlice.actions;
export default effectTextSlice.reducer;