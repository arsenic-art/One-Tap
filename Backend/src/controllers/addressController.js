const UserSavedAddress = require("../models/SavedAddress");

const getUserAddresses = async (req, res) => {
  try {
    const addresses = await UserSavedAddress.find({
      userId: req.user._id,
    }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.json({ addresses });
  } catch (error) {
    console.error("getUserAddresses error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getDefaultAddress = async (req, res) => {
  try {
    const address = await UserSavedAddress.findOne({
      userId: req.user._id,
      isDefault: true,
    });

    if (!address) {
      return res.status(404).json({ message: "No default address found" });
    }

    res.json({ address });
  } catch (error) {
    console.error("getDefaultAddress error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const addAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      serviceLine,
      city,
      state,
      pincode,
      isDefault,
    } = req.body;

    if (isDefault) {
      await UserSavedAddress.updateMany(
        { userId: req.user._id, isDefault: true },
        { isDefault: false }
      );
    }

    const address = await UserSavedAddress.create({
      userId: req.user._id,
      fullName,
      phone,
      email,
      serviceLine,
      city,
      state,
      pincode,
      isDefault: isDefault || false,
    });

    res.status(201).json({
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    console.error("addAddress error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      phone,
      email,
      serviceLine,
      city,
      state,
      pincode,
      isDefault,
    } = req.body;

    const address = await UserSavedAddress.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // If setting as default, unset any existing default
    if (isDefault && !address.isDefault) {
      await UserSavedAddress.updateMany(
        { userId: req.user._id, isDefault: true },
        { isDefault: false }
      );
    }

    address.fullName = fullName ?? address.fullName;
    address.phone = phone ?? address.phone;
    address.email = email ?? address.email;
    address.serviceLine = serviceLine ?? address.serviceLine;
    address.city = city ?? address.city;
    address.state = state ?? address.state;
    address.pincode = pincode ?? address.pincode;
    address.isDefault = isDefault ?? address.isDefault;

    await address.save();

    res.json({
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    console.error("updateAddress error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await UserSavedAddress.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("deleteAddress error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await UserSavedAddress.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Unset all other defaults
    await UserSavedAddress.updateMany(
      { userId: req.user._id, isDefault: true },
      { isDefault: false }
    );

    address.isDefault = true;
    await address.save();

    res.json({
      message: "Default address updated",
      address,
    });
  } catch (error) {
    console.error("setDefaultAddress error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserAddresses,
  getDefaultAddress,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
