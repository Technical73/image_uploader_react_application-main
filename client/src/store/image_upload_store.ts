import { configureStore } from "@reduxjs/toolkit";
import {
  upload_card_triggers,
  selectedImage_reducers,
  crop_card_reducers,
  crop_card_data,
} from "../features/image_upload_reducers";

const store = configureStore({
  reducer: {
    imageUploadReducer: upload_card_triggers,
    selectedImage: selectedImage_reducers,
    imageCropTriggers: crop_card_reducers,
    cropImage: crop_card_data,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
