const MechanicApplication = require("../models/MechanicApplication");

exports.browseMechanics = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const { city, vehicle, service } = req.query;

    const filter = { status: "approved" };

    if (city) {
      filter.city = {
        $regex: city.trim(),
        $options: "i",
      };
    }

    if (vehicle) {
      if (vehicle === "Both") {
        filter.vehicleSpecialization = { $in: ["Bike", "Car", "Both"] };
      } else {
        filter.vehicleSpecialization = { $in: [vehicle, "Both"] };
      }
    }

    if (service) {
      filter.servicesProvided = service;
    }

    const mechanics = await MechanicApplication.find(filter)
      .sort({ experienceYears: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "mechanicID fullStoreName city experienceYears vehicleSpecialization servicesProvided bio storeImages"
      );

    const total = await MechanicApplication.countDocuments(filter);

    res.status(200).json({
      data: mechanics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch mechanics" });
  }
};
