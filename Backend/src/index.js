require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const servicesRoutes = require("./routes/services");
const userRoutes = require("./routes/userAuth");
const mechanicRoutes = require("./routes/mechanicAuth");
const mechanicApplicationRoutes = require("./routes/newMechanicApplication");
const serviceRequestRoutes = require("./routes/serviceRequestRoutes");
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
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


connectDB().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on Port", process.env.PORT || 3000);
  });
});
