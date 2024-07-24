import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

const crop_card_reducers = createSlice({
  name: "imageCropTriggers",
  initialState,
  reducers: {
    cropCardOpen: (state) => {
      state.value = true;
    },
    cropCardClose: (state) => {
      state.value = false;
    },
  },
});

export const { cropCardClose, cropCardOpen } = crop_card_reducers.actions;

export default crop_card_reducers.reducer;
