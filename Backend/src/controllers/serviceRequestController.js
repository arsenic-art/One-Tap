const ServiceRequest = require("../models/ServiceRequest");
const Mechanic = require("../models/Mechanic");
const MechanicApplication = require("../models/MechanicApplication");
const Address = require("../models/SavedAddress");

exports.createRequest = async (req, res) => {
  try {
    const { mechanicId, problemType, serviceType, message } = req.body;

    if (!mechanicId || !problemType || !serviceType) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const mechanic = await Mechanic.findById(mechanicId);
    if (!mechanic) {
      return res.status(404).json({ message: "Mechanic not found" });
    }

    const application = await MechanicApplication.findOne({
      mechanicID: mechanicId,
      status: "approved",
    });

    if (!application) {
      return res.status(403).json({
        message: "This mechanic's application is not yet approved",
      });
    }

    const address = await Address.findOne({
      userId: req.user._id,
      isDefault: true,
    });

    if (!address) {
      return res
        .status(400)
        .json({ message: "Please add a service address first" });
    }

    // Check for duplicate pending requests
    const existingRequest = await ServiceRequest.findOne({
      userId: req.user._id,
      mechanicId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(409).json({
        message: "You already have a pending request with this mechanic",
      });
    }

    // Calculate estimated amount based on service type
    const estimatedAmount = getServicePrice(serviceType);

    const request = await ServiceRequest.create({
      userId: req.user._id,
      mechanicId,
      problemType,
      serviceType,
      message,
      userLocation: {
        address: `${address.serviceLine}, ${address.city}`,
        city: address.city,
        coordinates: {
          // TODO: Geocode address to get lat/lng
          lat: 0,
          lng: 0,
        },
      },
      estimatedAmount,
    });

    res.status(201).json({
      message: "Service request sent successfully",
      data: request,
    });
  } catch (error) {
    console.error("Create request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper function for service pricing
function getServicePrice(serviceType) {
  const prices = {
    "Emergency Roadside Assistance": 800,
    "Mobile Oil Change": 500,
    "Brake Inspection & Repair": 1200,
    "Battery Replacement": 1500,
    "Tire Services": 600,
    "Engine Diagnostics": 1000,
    "AC System Service": 1800,
    "Pre-Purchase Inspection": 700,
    "Preventive Maintenance": 900,
  };
  return prices[serviceType] || 500;
}

exports.getMechanicRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      mechanicId: req.mechanic._id,
    })
      .populate("userId", "firstName lastName email phoneNumber profileImage")
      .sort({ createdAt: -1 });

    res.json({ data: requests });
  } catch (error) {
    console.error("Get mechanic requests error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.mechanicId.toString() !== req.mechanic._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    request.status = "accepted";
    request.acceptedAt = new Date();
    await request.save();

    await request.populate("userId", "firstName lastName email phoneNumber");

    res.json({ message: "Request accepted", data: request });
  } catch (error) {
    console.error("Accept request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.mechanicId.toString() !== req.mechanic._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    request.status = "rejected";
    request.rejectedAt = new Date();
    await request.save();

    await request.populate("userId", "firstName lastName email phoneNumber");

    res.json({ message: "Request rejected", data: request });
  } catch (error) {
    console.error("Reject request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      userId: req.user._id,
    })
      .populate(
        "mechanicId",
        "firstName lastName email phoneNumber profileImage"
      )
      .sort({ createdAt: -1 });

    res.json({ data: requests });
  } catch (error) {
    console.error("Get user requests error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
