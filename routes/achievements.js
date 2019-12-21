const express = require("express");
const router = express.Router({ mergeParams: true });
const validator = require('express-joi-validation').createValidator({});
const { createAchievement, getAchievements, getAchievementsByUser, awardAchievement } = require("../controllers/achievements");
const { loginRequired, adminLoginRequired } = require("../middleware/auth");
const achievementsValidation = require('./validation/achievements');

router.post(
	"/awardAchievement",
	loginRequired,
	awardAchievement
);

router.get(
	"/",
	loginRequired,
	getAchievements
);

router.post(
	"/",
	validator.body(achievementsValidation.create.body),
	loginRequired,
	createAchievement
);

module.exports = router;