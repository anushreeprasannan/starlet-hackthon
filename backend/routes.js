const express = require("express");

const router = express.Router();

const authRoutes = require("./routes/authRoutes");
const locationRoutes = require("./routes/locationRoutes");
const medicalRoutes = require("./routes/medicalRoutes");
const sosRoutes = require("./routes/sosRoutes");

router.use("/", authRoutes);
router.use("/", locationRoutes);
router.use("/", medicalRoutes);
router.use("/", sosRoutes);

module.exports = router;