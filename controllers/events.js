const db = require("../models");
const uuidv1 = require('uuid/v1');

exports.createEvent = async function (req, res, next) {
	try {

        req.body.uuid = uuidv1();
        const event = await db.Events.create(req.body);

        return res.status(200).json(event);

    } catch (err) {
        console.log(err);

        if (err.code === 11000) {
            err.message = "Duplicated event name";
        }
        return next({
            status: 400,
            message: err.message
        });
    }
}

exports.getEvents = async function (req, res, next) {
    const events = await db.Events.find()
            .sort({ createdAt: "desc" });

    return res.status(200).json(events);
}
