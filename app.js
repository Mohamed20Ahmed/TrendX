const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 5000;

const express = require("express");
const app = express();

const cors = require("cors");

app.use(express.json());
app.use(cors());

app.listen(port, (err) => {
  if (err) console.log("Error:", err);
  console.log("Server is running on port ", port);
});

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connected to mongodb server");
});
