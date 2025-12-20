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

    const storeImages = req.files?.map((file) => ({
      url: file.path,        
      public_id: file.filename,
    })) || [];

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
  const application = await MechanicApplication.findOne({
    mechanicID: req.mechanic._id,
  });

  if (!application) {
    return res.status(404).json({ message: "No application found" });
  }

  res.json(application);
};

module.exports = {
  submitApplication,
  getMyApplication,
};
