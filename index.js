const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.get("/", (req, res, next) => {
  res.status(200).json({ status: "success!" });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
