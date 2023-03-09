const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')
const AppError = require("./utils/appError")
const itemsRoutes = require("./routes/itemRoutes");
const loginRoutes = require("./routes/loginRoutes")

const app = express();

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(express.static('static'))

app.use("/items", itemsRoutes);
app.use("/api", loginRoutes)
app.get('/', (req, res) => {
  res.send('This api are running.')
})

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

module.exports = app;