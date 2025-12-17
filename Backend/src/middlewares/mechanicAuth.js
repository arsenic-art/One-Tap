const jwt = require("jsonwebtoken");
const Mechanic = require("../models/mechanic");

const protectMechanic = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.mechanic = await Mechanic.findById(decoded.id).select("-password");

    if (!req.mechanic) {
      return res.status(401).json({ message: "Not authorized" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = protectMechanic;
