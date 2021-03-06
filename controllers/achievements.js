const db = require("../models");
const uuidv1 = require('uuid/v1');

exports.createAchievement = async function (req, res, next) {
    try {

        req.body.uuid = uuidv1();
        const achievement = await db.Achievements.create(req.body);

        return res.status(200).json(achievement);

    } catch (err) {
        console.log(err);

        if (err.code === 11000) {
            err.message = "Duplicated achievement name";
        }
        return next({
            status: 400,
            message: err.message
        });
    }
}

exports.getAchievements = async function (req, res, next) {
    const achievements = await db.Achievements.find()
            .sort({ createdAt: "desc" });

    return res.status(200).json(achievements);
}


exports.getAchievementsByUser = async function (req, res, next) {
    const achievements = await db.Achievements.find({

            })
            .sort({ createdAt: "desc" });

    return res.status(200).json(achievements);
}
