const express = require("express");
const router = express.Router({ mergeParams: true });
const validator = require('express-joi-validation').createValidator({});
const { getEvent, getEvents, createEvent } = require("../controllers/events");
const eventsValidation = require('./validation/events');

router.get("/", getEvents);
// router.get("/:eventUuid", getEvent);
router.post(
	"/",
	validator.body(eventsValidation.create.body),
	createEvent
);

module.exports = router;