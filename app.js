const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')
const AppError = require("./utils/appError")
const itemsRoutes = require("./routes/itemRoutes");
const coursevilleRoutes = require("./routes/coursevilleRoutes")

const app = express();

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(express.static('static'))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/items", itemsRoutes);
app.use("/courseville", coursevilleRoutes)
app.get('/', (req, res) => {
  res.send('Congratulation. This server is succesfully run.')
})

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

module.exports = app;