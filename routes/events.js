const express = require("express");
const router = express.Router({ mergeParams: true });
const { getEvent, getEvents, createEvent } = require("../controllers/events");

router.get("/", getEvents);
// router.get("/:eventUuid", getEvent);
router.post("/", createEvent);

module.exports = router;