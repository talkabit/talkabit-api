const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const { navbar } = require("../controllers/html");

router.get(
    "/navbar",
    isLoggedIn,
    navbar
);

module.exports = router;