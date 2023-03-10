const express = require("express");
const coursevilleController = require("../controller/coursevilleController");

const router = express.Router();

router.get("/access_token", coursevilleController.accessToken);

module.exports = router;