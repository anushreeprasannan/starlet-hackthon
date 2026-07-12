const express = require("express");

const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());

const routes = require("./routes");

app.use("/", routes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Guardian Angel Backend Running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});