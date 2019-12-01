const express = require("express");
const router = express.Router();
const { loginRequired } = require("../middleware/auth");
const { getUser } = require("../controllers/html");

router.get(
    "/getuser",
    loginRequired,
    getUser
);

module.exports = router;