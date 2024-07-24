import { createSlice } from "@reduxjs/toolkit";

interface Obj {
  image_name: string;
}
const initialState: Obj = {
  image_name: "",
};

const selectedImage_reducers = createSlice({
  name: "selectedImage",
  initialState,
  reducers: {
    selectedData: (state, action) => {
      state.image_name = action.payload;
    },
  },
});

export const { selectedData } = selectedImage_reducers.actions;

export default selectedImage_reducers.reducer;
