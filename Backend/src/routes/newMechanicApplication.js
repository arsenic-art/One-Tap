const express = require("express");
const router = express.Router();

const {
  submitApplication,
  getMyApplication,
} = require("../controllers/mechanicFormController");

const upload = require("../middlewares/upload");
const { protectMechanic } = require("../middlewares/mechanicAuth");

router.post(
  "/",
  protectMechanic,
  upload.array("storeImages", 3),
  submitApplication
);

router.get("/me", protectMechanic, getMyApplication);

module.exports = router;
