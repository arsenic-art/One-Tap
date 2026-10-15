const multer = require("multer");
const storagePackage = require("multer-storage-cloudinary");
const CloudinaryStorage = storagePackage.CloudinaryStorage || storagePackage;
const cloudinary = require("../config/cloudinary.config");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "OneTap/MechanicApplications",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({
  storage,
  limits: {
    files: 1,
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = upload;
