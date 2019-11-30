const express = require("express");
const router = express.Router();
const validator = require('express-joi-validation').createValidator({});
const { addUser } = require("../controllers/eventbrite");
const eventBriteValidation = require('./validation/eventbrite');

router.post(
    "/",
    validator.body(eventBriteValidation.create.body),
    addUser
);

module.exports = router;