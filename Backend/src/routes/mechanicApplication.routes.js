const express = require("express");
const router = express.Router();

const {
  submitApplication,
  getMyApplication,
  updateApplication,
  checkApplicationStatus,
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
router.get("/status", protectMechanic, checkApplicationStatus);
router.put(
  "/",
  protectMechanic,
  upload.array("storeImages", 3),
  updateApplication
);

module.exports = router;
