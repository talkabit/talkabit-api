const db = require("../models");
const uuidv1 = require('uuid/v1');

const achievementSelectFilter = "-__v -_id -createdAt -updatedAt -users";
const achievementAdminSelectFilter = "-__v -_id -users.__v -users._id -users.events";

exports.awardAchievement = async function (req, res, next) {
    console.log("TODO - IMPLEMENT")
    return res.status(201).json({});
}

exports.createAchievement = async function (req, res, next) {
    try {

        req.body.uuid = uuidv1();
        const achievement = await db.Achievements.create(req.body);

        return res.status(201).json(achievement);

    } catch (err) {
        console.log(err);

        if (err.code === 11000) {
            err.message = "Duplicated achievement";
        }
        return next({
            status: 400,
            message: err.message
        });
    }
}

exports.getAchievements = async function (req, res, next) {
    let achievements = [];

    if(req.user.admin)
        achievements = await db.Achievements.find()
            .sort({ createdAt: "desc" })
            .populate('users')
            .select(achievementAdminSelectFilter)
    else
        achievements = await db.Achievements.find()
            .sort({ createdAt: "desc" })
            .select(achievementSelectFilter)

    return res.status(200).json(achievements);
}


exports.getAchievementsByUser = async function (req, res, next) {
    const achievements = await db.Achievements.find({

            })
            .sort({ createdAt: "desc" });

    return res.status(200).json(achievements);
}
