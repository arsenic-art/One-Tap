const MechanicApplication = require("../models/MechanicApplication");

const submitApplication = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Invalid multipart form data" });
    }

    const mechanicID = req.mechanic._id;

    const exists = await MechanicApplication.findOne({ mechanicID });
    if (exists) {
      return res.status(400).json({ message: "Application already submitted" });
    }

    let storeImages = [];
    const file =
      req.file || (req.files && req.files.length > 0 ? req.files[0] : null);

    if (file) {
      storeImages.push({
        url: file.path,
        public_id: file.filename,
      });
    }

    const application = await MechanicApplication.create({
      mechanicID,
      fullStoreName: req.body.fullStoreName,
      email: req.body.email,
      phone: req.body.phone,
      city: req.body.city,
      experienceYears: Number(req.body.experienceYears),
      vehicleSpecialization: req.body.vehicleSpecialization,
      servicesProvided: req.body.servicesProvided
        ? JSON.parse(req.body.servicesProvided)
        : [],
      certifications: req.body.certifications,
      availability: req.body.availability
        ? JSON.parse(req.body.availability)
        : {},
      bio: req.body.bio,
      storeImages, 
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyApplication = async (req, res) => {
  try {
    const application = await MechanicApplication.findOne({
      mechanicID: req.mechanic._id,
    });

    if (!application) {
      return res.status(404).json({ message: "No application found" });
    }

    res.json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateApplication = async (req, res) => {
  try {
    const mechanicID = req.mechanic._id;
    let application = await MechanicApplication.findOne({ mechanicID });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (req.body.fullStoreName)
      application.fullStoreName = req.body.fullStoreName;
    if (req.body.email) application.email = req.body.email;
    if (req.body.phone) application.phone = req.body.phone;
    if (req.body.city) application.city = req.body.city;
    if (req.body.experienceYears)
      application.experienceYears = Number(req.body.experienceYears);
    if (req.body.vehicleSpecialization)
      application.vehicleSpecialization = req.body.vehicleSpecialization;
    if (req.body.certifications)
      application.certifications = req.body.certifications;
    if (req.body.bio) application.bio = req.body.bio;

    if (req.body.servicesProvided)
      application.servicesProvided = JSON.parse(req.body.servicesProvided);
    if (req.body.availability)
      application.availability = JSON.parse(req.body.availability);

    // Logic to delete existing image
    if (req.body.deleteStoreImage === "true") {
      application.storeImages = [];
    }

    // Logic to replace with new single image
    const file =
      req.file || (req.files && req.files.length > 0 ? req.files[0] : null);

    if (file) {
      application.storeImages = [
        {
          url: file.path,
          public_id: file.filename,
        },
      ];
    }

    const updatedApplication = await application.save();

    res.json({
      message: "Application updated successfully",
      application: updatedApplication,
    });
  } catch (err) {
    console.error("Update Application Error:", err);
    res.status(500).json({ message: "Server error updating application" });
  }
};

const checkApplicationStatus = async (req, res) => {
  try {
    const application = await MechanicApplication.findOne({
      mechanicID: req.mechanic._id,
    });

    if (!application) {
      return res.status(404).json({
        message: "No application found",
        hasApplication: false,
      });
    }

    res.json({
      hasApplication: true,
      status: application.status,
      application,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  submitApplication,
  getMyApplication,
  updateApplication,
  checkApplicationStatus,
};
