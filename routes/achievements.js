const express = require("express");
const router = express.Router({ mergeParams: true });
const validator = require('express-joi-validation').createValidator({});
const { getAchievements, createAchievement } = require("../controllers/achievements");
const { loginRequired, adminLoginRequired } = require("../middleware/auth");
const achievementsValidation = require('./validation/achievements');

router.get(
	"/",
	loginRequired,
	getAchievements
);

router.post(
	"/",
	validator.body(achievementsValidation.create.body),
	adminLoginRequired,
	createAchievement
);

module.exports = router;