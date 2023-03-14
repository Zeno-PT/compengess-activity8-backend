const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const AppError = require("./utils/appError");
const itemsRoutes = require("./routes/itemRoutes");
const coursevilleRoutes = require("./routes/coursevilleRoutes");

const app = express();


const sessionOptions = {
  secret: "my-secret",
  resave: true,
  saveUninitialized: false,
  // cookie: {
  //   // setting this false for http connections
  //   secure: false,
  //   // httpOnly: false
  // },
  // genid: (req) => {
  //   // Use the client's IP address as the session ID
  //   return req.ip;
  // }
};

const corsOptions = {
  origin: ["http://127.0.0.1:8000", "http://44.214.169.149"],
  // optionsSuccessStatus: 200,
  credentials: true // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(session(sessionOptions));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("static"));

app.use("/items", itemsRoutes);
app.use("/courseville", coursevilleRoutes);
app.get("/", (req, res) => {
  res.send("Congratulation. This server is succesfully run.");
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

module.exports = app;
