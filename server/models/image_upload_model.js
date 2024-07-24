const mongoose = require("mongoose");

const ImagesSchema = new mongoose.Schema({
  image_name: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  selection: {
    type: Boolean,
    required: true,
  },
});

const ImagesData = mongoose.model("Image", ImagesSchema);
module.exports = ImagesData;
