const express = require("express");
const router = express.Router({ mergeParams: true });
const validator = require('express-joi-validation').createValidator({});
const { createAchievement, getAchievements, getAchievementsByUser } = require("../controllers/achievements");
const achievementsValidation = require('./validation/achievements');

router.get(
	"/",
	getAchievements
);

router.post(
	"/",
	validator.body(achievementsValidation.create.body),
	createAchievement
);

module.exports = router;