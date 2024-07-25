require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const imageRoutes = require("./routes/image_routes");
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
app.use("/images", imageRoutes);

mongoose
  .connect(
    "mongodb+srv://jagadishwaranvr345:uUpCy6O48ZmJQjvz@imageupload.w0ns7je.mongodb.net/images?retryWrites=true&w=majority&appName=imageupload",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(8000, () => {
      console.log("server is connected");
    });
    console.log("database is connected");
  })
  .catch((err) => {
    console.log("Error connecting to the database", err);
    process.exit(1);
  });

module.exports = app;
