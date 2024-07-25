require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const imageRoutes = require("./routes/image_routes");

const app = express();

// Configure CORS
app.use(
  cors({
    origin: "https://image-uploader-react-application-client.vercel.app", // replace with your client URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // if you need to include cookies in the requests
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/images", imageRoutes);

app.use("/", (req, res) => {
  res.status(200).json({ message: "hello world" });
});

const dbUrl = process.env.DB_CONNECTION_URL;
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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
