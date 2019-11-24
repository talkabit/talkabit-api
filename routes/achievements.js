const express = require("express");
const router = express.Router({ mergeParams: true });
const { createAchievement, getAchievements, getAchievementsByUser } = require("../controllers/achievements");

router.get("/", getAchievements);
router.post("/", createAchievement);

module.exports = router;