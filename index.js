// Dotenv handy for local config & debugging
require("dotenv").config();

// Core Express & logging stuff
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");

const app = express();

const path = require("path");

// Logging
app.use(logger("dev"));

//cors
const cors = require("cors");
const helmet = require("helmet");
const connectToDB = require("./db/db-connection");
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

//wearing a helmet
app.use(helmet());
// Parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public/upload")));

// Routes & controllers
app.get("/api", (req, res) =>
  res.json({ msg: " Welcome to Online Assignment" })
);
app.use("/api/user", require("./src/routes/user-route"));
app.use("/api/product", require("./src/routes/product-route"));

// app.use("/admin", require("./src/routes/admin"));

// Catch all route, generate an error & forward to error handler
// app.use(function (req, res, next) {
//   let err = new Error("Not Found");
//   err.status = 404;
//   next(err);
// });

// app.use(errorHandler);

app.use(function (req, res, next) {
  const { errorResponse } = require("./src/utils/constants");
  res.status(404).json(errorResponse("API NOT FOUND", res.statusCode));
});

// Get values from env vars or defaults where not provided
let port = process.env.PORT || 3002;

// Start the server
app.listen(port, async () => {
  await connectToDB();
  console.log(`Server Started in This Port  ${port}`);
  console.log("DB connected And working");
});

module.exports = app;
