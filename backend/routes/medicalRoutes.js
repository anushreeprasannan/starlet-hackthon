const express = require("express");
const router = express.Router();

const {
    saveMedical,
    getMedical
} = require("../controller/medicalController");

router.post("/medical", saveMedical);

router.get("/medical/:uid", getMedical);

module.exports = router;