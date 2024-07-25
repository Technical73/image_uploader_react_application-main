const express = require("express");
const router = express.Router();
const ImagesData = require("../models/image_upload_model");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (["image/png", "image/jpeg"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file format"));
    }
  },
});

router.post(
  "/upload",
  async (req, res, next) => {
    try {
      const imageCount = await ImagesData.countDocuments();
      if (imageCount >= 5) {
        return res.status(400).json({
          message:
            "You've reached the image limit. Remove one or more to upload more images.",
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        message:
          "An unexpected error occurred during the upload. Please contact support if the issue persists.",
      });
    }
  },
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      let newImage = {
        image_name: req.file.filename,
        size: req.file.size,
        selection: false,
      };

      let imageData = await ImagesData.create(newImage);
      console.log(req.file);
      return res
        .status(200)
        .json({ message: "Image uploaded successfully", imageData });
    } catch (error) {
      console.error("Error during image upload:", error);
      if (error.message === "Unsupported file format") {
        return res.status(400).json({
          message: `The file format of ${req.file.originalname} is not supported. Please upload an image in one of the following formats: JPG or PNG.`,
        });
      }
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message:
            "This image is larger than 5MB. Please select a smaller image.",
        });
      }
      return res.status(500).json({
        message:
          "An unexpected error occurred during the upload. Please contact support if the issue persists.",
      });
    }
  }
);

router.delete("/upload/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await ImagesData.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getimages", async (req, res) => {
  try {
    const data = await ImagesData.find();
    res
      .status(200)
      .json({ message: "Image retrieved successfully", image: data });
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ message: "Error fetching image" });
  }
});

router.get("/upload/getimage/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await ImagesData.findById(id);
    if (!data) {
      return res.status(404).json({ message: "Image not found" });
    }

    res
      .status(200)
      .json({ message: "Image retrieved successfully", image: data });
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ message: "Error fetching image" });
  }
});

router.post("/upload/submit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const image = await ImagesData.findOneAndUpdate(
      { _id: id },
      { $set: { selection: true } },
      { new: true }
    );
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.status(200).json({ message: "Image submitted successfully", image });
  } catch (error) {
    console.error("Error submitting image:", error);
    res.status(500).json({ message: "Error submitting image" });
  }
});

module.exports = router;
