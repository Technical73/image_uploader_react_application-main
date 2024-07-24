import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "",
};

const crop_card_data = createSlice({
  name: "cropImage",
  initialState,
  reducers: {
    cropData: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { cropData } = crop_card_data.actions;

export default crop_card_data.reducer;
