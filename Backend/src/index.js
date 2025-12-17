require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db.js");
const PORT = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoutes = require("./routes/userAuth.js");
const mechanicRoutes = require("./routes/mechanicAuth.js");


app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/api/user", userRoutes);
app.use("/api/mechanic", mechanicRoutes);


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("App is listening on ", PORT);
  });
});
