const express = require("express");
const router = express.Router();

const {
  submitApplication,
  getMyApplication,
} = require("../controllers/mechanicApplicationController");

const upload = require("../middlewares/upload.middleware");
const { protectMechanic } = require("../middlewares/mechanicAuth.middleware");

router.post(
  "/",
  protectMechanic,
  upload.array("storeImages", 3),
  submitApplication
);

router.get("/me", protectMechanic, getMyApplication);

module.exports = router;
