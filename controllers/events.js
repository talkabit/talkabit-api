const db = require("../models");
const uuidv1 = require('uuid/v1');

const eventSelectFilter = "-__v -_id -createdAt -updatedAt -users";
const eventAdminSelectFilter = "-__v -_id -users.__v -users._id -users.achievements";

exports.createEvent = async function (req, res, next) {
	try {

        req.body.uuid = uuidv1();
        const event = await db.Events.create(req.body);

        return res.status(201).json(event);

    } catch (err) {
        console.log(err);

        if (err.code === 11000) {
            err.message = "Event already exists";
        }
        return next({
            status: 500,
            message: err.message
        });
    }
}

exports.getEvents = async function (req, res, next) {

    let events = [];

    if(req.user.admin)
        events = await db.Events.find()
            .populate('users')
            .sort({ createdAt: "desc" })
            .select(eventAdminSelectFilter);
    else
        events = await db.Events.find()
            .sort({ createdAt: "desc" })
            .select(eventSelectFilter);

    return res.status(200).json(events);
}
