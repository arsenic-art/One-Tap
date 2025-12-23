module.exports.validateBooking = (req, res, next) => {
  const { user, vehicle, booking } = req.body;

  if (!user?.fullName || !user?.phone || !user?.address)
    return res.status(400).json({ error: "Missing user details" });

  if (!vehicle?.make || !vehicle?.model || !vehicle?.year)
    return res.status(400).json({ error: "Missing vehicle details" });

  if (!booking?.selectedServices?.length)
    return res.status(400).json({ error: "At least one service required" });

  if (!booking.preferredDate || !booking.preferredTime)
    return res.status(400).json({ error: "Schedule required" });

  next();
};
