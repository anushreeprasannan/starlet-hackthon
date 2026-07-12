const express = require("express");
const router = express.Router();

const {
    sendSOS,
    getSOS
} = require("../controller/sosController");

router.post("/sos", sendSOS);

router.get("/sos/:uid", getSOS);

module.exports = router;