const express = require("express");
const router = express.Router();
const { browseMechanics } = require("../controllers/mechanicBrowseController");

router.get("/", browseMechanics);

module.exports = router;