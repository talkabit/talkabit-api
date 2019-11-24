const express = require("express");
const router = express.Router();
const { createUser, loginUser, updateUser, getUser, addAchievementToUser } = require("../controllers/users");
const { loginRequired, ensureCorrectUser } = require("../middleware/auth");

router.get("/:userUuid", loginRequired, getUser);
router.post("/", createUser);
router.post("/login", loginUser);
router.put("/:userUuid", updateUser);
router.post("/:userUuid/achievements", addAchievementToUser);

module.exports = router;