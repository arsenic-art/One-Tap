const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth.middleware");
const {
  getUserAddresses,
  getDefaultAddress,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/addressController");

router.use(userAuth);

router.get("/", getUserAddresses);
router.get("/default", getDefaultAddress);
router.post("/", addAddress);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);
router.put("/:id/set-default", setDefaultAddress);

module.exports = router;
