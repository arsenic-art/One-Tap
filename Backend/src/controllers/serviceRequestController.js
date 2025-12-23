const ServiceRequest = require("../models/ServiceRequest");
const Mechanic = require("../models/Mechanic");

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

    const request = await ServiceRequest.create({
      userId: req.user._id,
      mechanicId,
      problemType,   
      serviceType,    
      message,
    });

    res.status(201).json({
      message: "Service request sent",
      data: request,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Request already pending" });
    }

    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getUserRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      userId: req.user._id,
    })
      .populate("mechanicId", "firstName lastName email profileImage")
      .sort({ createdAt: -1 });

    res.json({ data: requests });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMechanicRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      mechanicId: req.mechanic._id,
    })
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json({ data: requests });
  } catch (error) {
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

    request.status = "accepted";
    await request.save();

    res.json({ message: "Request accepted" });
  } catch (error) {
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

    request.status = "rejected";
    await request.save();

    res.json({ message: "Request rejected" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
