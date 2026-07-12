const express = require("express");
const router = express.Router();

const {
    saveLocation,
    getLocation
} = require("../controller/locationController");

router.post("/location", saveLocation);

router.get("/location/:uid", getLocation);

module.exports = router;