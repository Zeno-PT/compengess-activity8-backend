const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')
const session = require('express-session')
const AppError = require("./utils/appError")
const itemsRoutes = require("./routes/itemRoutes");
const coursevilleRoutes = require("./routes/coursevilleRoutes")

const app = express();

app.use(session({secret: 'my-secret', resave: false, saveUninitialized: false}))
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(express.static('static'))

app.use("/items", itemsRoutes);
app.use("/courseville", coursevilleRoutes)
app.get('/', (req, res) => {
  res.send('Congratulation. This server is succesfully run.')
})

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

module.exports = app;