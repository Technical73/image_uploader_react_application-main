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

const dbUrl = `${process.env.DATABASE_URL}/images`;

mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("server is connected");
    });
    console.log("database is connected");
  })
  .catch((err) => {
    console.log("Error connecting to the database", err);
    process.exit(1);
  });
