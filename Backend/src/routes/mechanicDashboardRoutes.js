const express = require("express");
const router = express.Router();
const { protectMechanic } = require("../middlewares/mechanicAuth.middleware");
const {
  getMechanicDashboard,
  startRequest,
  completeRequest,
} = require("../controllers/mechanicDashboardController");
const {
  acceptRequest,
  rejectRequest,
} = require("../controllers/serviceRequestController");

router.get("/dashboard", protectMechanic, getMechanicDashboard);

router.put("/requests/:id/accept", protectMechanic, acceptRequest);
router.put("/requests/:id/reject", protectMechanic, rejectRequest);
router.put("/requests/:id/start", protectMechanic, startRequest);
router.put("/requests/:id/complete", protectMechanic, completeRequest);

module.exports = router;
