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
const addressRoutes = require("./routes/addressRoutes");
const mechanicDashboardRoutes = require("./routes/mechanicDashboardRoutes");

app.set("trust proxy", 1);
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:7777",
  "https://onetap.vercel.app",
  process.env.CORS_ORIGIN,
]; 

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to the One Tap Mechanic Service API");
});
app.use("/api/user", userRoutes);
app.use("/api/mechanic", mechanicRoutes);
app.use("/api/mechanicdash", mechanicDashboardRoutes);
app.use("/api/mechanic-application", mechanicApplicationRoutes);
app.use("/api/mechanicsList", servicesRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api", bookingRoutes);
app.use("/api/address", addressRoutes);
connectDB().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on Port", process.env.PORT || 3000);
  });
});
