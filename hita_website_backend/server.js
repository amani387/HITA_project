const express = require("express");
const router = require("router");
const Axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const api = require("./routes/user.routes");
// const multer = require("multer");
// const http = require("http");
// const path = require("path");
// const fs = require("fs");

mongoose
  .connect("mongodb://127.0.0.1:27017/HintaInfo")
  .then((x) => {
    console.log(`Connected to Db ! with Db name : "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("Error Occured Connecting to Mongo", err.reason);
  });

const server = express();

server.use(cors());
server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

server.use("/public", express.static("public"));
server.use("/api", api);

const port = process.env.PORT || 5000;

server.listen(5000, (req, res) => {
  console.log("Hi , wel come , the server is up @ :" + port);
});

server.use((req, res, next) => {
  setImmediate(() => {
    next(new Error("Something went wrong"));
  });
});

server.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode == 500;
  res.status(err.statusCode).send(err.message);
});

// server.get("/news", (req, res) => {
//   const response = Axios.get(
//     "https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=32f3783c44af4309acaf48a289f599e9"
//   );

//   console.log(response);

//   res.json(response.data.articles);
// });
