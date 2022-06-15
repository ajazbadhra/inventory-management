const express = require("express");
const router = new express.Router();
const { showStock } = require("../controller/stockController");

router.route("/stocks").get(showStock);

module.exports = router;
