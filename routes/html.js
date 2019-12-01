const express = require("express");
const router = express.Router();
const { loginRequired } = require("../middleware/auth");
const { navbar } = require("../controllers/html");

router.get(
    "/navbar",
    loginRequired,
    navbar
);

module.exports = router;