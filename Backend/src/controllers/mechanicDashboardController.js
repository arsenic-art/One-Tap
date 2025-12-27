const ServiceRequest = require("../models/ServiceRequest");
const User = require("../models/User");

exports.getMechanicDashboard = async (req, res) => {
  try {
    const mechanicId = req.mechanic._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allRequests = await ServiceRequest.find({
      mechanicId,
    })
      .populate("userId", "firstName lastName email phoneNumber")
      .sort({ createdAt: -1 });

    const todaysRequests = await ServiceRequest.countDocuments({
      mechanicId,
      createdAt: { $gte: today },
    });

    const completedCount = await ServiceRequest.countDocuments({
      mechanicId,
      status: "completed",
    });

    const formattedRequests = allRequests.map((req) => ({
      id: req._id,
      status: req.status === "pending" ? "new" : req.status,
      customerName: `${req.userId.firstName} ${req.userId.lastName}`,
      customerPhone: req.userId.phoneNumber,
      customerEmail: req.userId.email,
      vehicle: req.problemType,
      issue: req.serviceType,
      message: req.message,
      location: req.userLocation?.address || "Location not provided",
      city: req.userLocation?.city || "",
      createdAt: req.createdAt,
      etaMinutes: calculateETA(req.userLocation?.coordinates), // Furture things
      amount: req.estimatedAmount || 0,
    }));

    res.json({
      summary: {
        today: todaysRequests,
        active: allRequests.filter((r) =>
          ["accepted", "in-progress"].includes(r.status)
        ).length,
        completed: completedCount,
      },
      requests: formattedRequests,
    });
  } catch (error) {
    console.error("getMechanicDashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

function calculateETA(coordinates) {
  // TODO: Integrate with Google Maps Distance Matrix API
  // For now 10-30 mins
  return Math.floor(Math.random() * 20) + 10;
}

exports.startRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.mechanicId.toString() !== req.mechanic._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (request.status !== "accepted") {
      return res
        .status(400)
        .json({ message: "Request must be accepted first" });
    }

    request.status = "in-progress";
    request.startedAt = new Date();
    await request.save();

    res.json({ message: "Request started", data: request });
  } catch (error) {
    console.error("startRequest error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.completeRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.mechanicId.toString() !== req.mechanic._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!["accepted", "in-progress"].includes(request.status)) {
      return res.status(400).json({ message: "Cannot complete this request" });
    }

    request.status = "completed";
    request.completedAt = new Date();
    await request.save();

    res.json({ message: "Request completed", data: request });
  } catch (error) {
    console.error("completeRequest error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = exports;
