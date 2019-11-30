const express = require("express");
const router = express.Router();
const { createUser, registerUser, loginUser, loginAdmin, updateUser, getUser, getUsers, addAchievementToUser, addEventToUser } = require("../controllers/users");
const { loginRequired, adminLoginRequired, ensureSelfOrAdmin } = require("../middleware/auth");
const { navbar } = require("../controllers/html");

router.get(
	"/navbar",
    loginRequired,
    navbar
);

module.exports = router;