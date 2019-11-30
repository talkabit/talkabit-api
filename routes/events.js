const express = require("express");
const router = express.Router({ mergeParams: true });
const validator = require('express-joi-validation').createValidator({});
const { getEvent, getEvents, createEvent } = require("../controllers/events");
const { loginRequired, adminLoginRequired } = require("../middleware/auth");
const eventsValidation = require('./validation/events');

router.get(
	"/",
	loginRequired,
	getEvents
);

router.post(
	"/",
	validator.body(eventsValidation.create.body),
	adminLoginRequired,
	createEvent
);

module.exports = router;