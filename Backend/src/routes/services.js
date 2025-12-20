const express = require("express");
const router = express.Router();
const { browseMechanics } = require("../controllers/mechanicBrowse");

router.get("/", browseMechanics);

module.exports = router;