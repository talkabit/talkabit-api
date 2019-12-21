const express = require("express");
const router = express.Router();
const validator = require('express-joi-validation').createValidator({});
const { addUser, addUserDebug } = require("../controllers/eventbrite");
const eventBriteValidation = require('./validation/eventbrite');
const { debugKey } = require('../middleware/auth');

router.post(
    "/debug",
    debugKey,
    addUserDebug
);

router.post(
    "/",
    validator.body(eventBriteValidation.create.body),
    addUser
);

module.exports = router;