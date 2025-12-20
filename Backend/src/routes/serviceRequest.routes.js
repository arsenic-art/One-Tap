const express = require("express");
const router = express.Router();

const {
  createRequest,
  getUserRequests,
  getMechanicRequests,
  acceptRequest,
  rejectRequest,
} = require("../controllers/serviceRequestController");

const { userAuth } = require("../middlewares/auth.middleware");
const { protectMechanic } = require("../middlewares/mechanicAuth.middleware");

router.post("/requests", userAuth, createRequest);
router.get("/requests/user", userAuth, getUserRequests);

router.get("/requests/mechanic", protectMechanic, getMechanicRequests);
router.patch("/requests/:id/accept", protectMechanic, acceptRequest);
router.patch("/requests/:id/reject", protectMechanic, rejectRequest);

module.exports = router;
