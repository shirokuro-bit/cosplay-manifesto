import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const SELECT_ID_SLICE_NAME = "selectId";


const initialState: { id: string | null } = {id: null};

const selectIdSlice = createSlice({
  name: SELECT_ID_SLICE_NAME,
  initialState,
  reducers: {
    select: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    unselect: (state) => {
      state.id = null;
    }
  }
});

export const {select, unselect} = selectIdSlice.actions;
export default selectIdSlice.reducer;