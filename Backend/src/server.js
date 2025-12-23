require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const servicesRoutes = require("./routes/services.routes");
const userRoutes = require("./routes/auth.routes");
const mechanicRoutes = require("./routes/mechanicAuth.routes");
const mechanicApplicationRoutes = require("./routes/mechanicApplication.routes");
const serviceRequestRoutes = require("./routes/serviceRequest.routes");
const bookingRoutes = require("./routes/bookingRoutes");
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/mechanic", mechanicRoutes);
app.use("/api/mechanic-application", mechanicApplicationRoutes);
app.use("/api/mechanicsList", servicesRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api", bookingRoutes);

connectDB().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on Port", process.env.PORT || 3000);
  });
});
