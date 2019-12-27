const db = require("../models");
const filters = require('./filters');
const uuidv1 = require('uuid/v1');

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
            .populate({
                path: 'users',
                select: filters.adm.userFilter
            })
            .sort({ createdAt: "desc" })
            .select(filters.adm.eventFilter);
    else
        events = await db.Events.find()
            .sort({ createdAt: "desc" })
            .select(filters.usr.eventFilter);

    return res.status(200).json(events);
}
