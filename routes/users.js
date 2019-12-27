const express = require("express");
const router = express.Router();
const validator = require('express-joi-validation').createValidator({});
const { createUser, registerUser, loginUser, loginAdmin, updateUser, getUser, getUsers, addAchievementToUser, addEventToUser } = require("../controllers/users");
const { loginRequired, adminLoginRequired, ensureSelfOrAdmin } = require("../middleware/auth");
const usersValidation = require('./validation/users');

router.get(
	"/",
	adminLoginRequired,
	getUsers
);

router.get(
	"/:userUuid",
	validator.params(usersValidation.get.params),
	loginRequired,
	ensureSelfOrAdmin,
	getUser
);

// router.post(
// 	"/", 
// 	validator.body(usersValidation.create.body),
// 	createUser
// );

router.post(
	"/register",
	validator.body(usersValidation.register.body),
	registerUser
);

router.post(
	"/login",
	validator.body(usersValidation.login.body),
	loginUser
);

router.post(
	"/loginAdmin",
	validator.body(usersValidation.loginAdmin.body),
	loginAdmin
);

router.put(
	"/:userUuid",
	validator.params(usersValidation.update.params),
	validator.body(usersValidation.update.body),
	loginRequired,
	ensureSelfOrAdmin,
	updateUser
);

router.post(
	"/:userUuid/achievements",
	validator.params(usersValidation.addAchievement.params),
	validator.body(usersValidation.addAchievement.body),
	loginRequired,
	ensureSelfOrAdmin,
	addAchievementToUser
);

router.post(
	"/:userUuid/events",
	validator.params(usersValidation.addEvent.params),
	validator.body(usersValidation.addEvent.body),
	loginRequired,
	ensureSelfOrAdmin,
	addEventToUser
);

module.exports = router;