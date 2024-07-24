import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

const upload_card_triggers = createSlice({
  name: "imageUploadTriggers",
  initialState,
  reducers: {
    uploadCardOpen: (state) => {
      state.value = true;
    },
    uploadCardClose: (state) => {
      state.value = false;
    },
  },
});

export const { uploadCardClose, uploadCardOpen } = upload_card_triggers.actions;

export default upload_card_triggers.reducer;
