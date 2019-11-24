const db = require("../models");
const uuidv1 = require('uuid/v1');
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const jwtOptions = {
    expiresIn: "1h"
}

const userSelectFilter = "-__v -_id -password";

exports.createUser = async function (req, res, next) {

    try {

        req.body.uuid = uuidv1();

        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        req.body.password = hashedPassword;
        const user = await db.Users.create(req.body);
        const { uuid, name } = user;

        const token = jwt.sign({
            uuid,
            name
        }, process.env.SECRET_KEY, jwtOptions);

        return res.status(200).json({
            uuid, name, token
        });
        
    } catch (err) {

        if (err.code === 11000) {
            err.message = "Sorry, that nickname is taken";
        }
        return next({
            status: 400,
            message: err.message
        });

    }
}


exports.loginUser = async function (req, res, next) {

    try {

        const user = await db.Users.findOne({
            email: req.body.email
        });
        
        if(user == undefined)
            throw "derp";

        const { uuid, name, email } = user;
        const isMatch = await user.comparePassword(req.body.password);

        if (isMatch) {

            const token = jwt.sign({
                uuid, name
            }, process.env.SECRET_KEY);

            return res.status(200).json({
                uuid, name, email, token
            });
        }
        else {
            return next({
                status: 400,
                message: "Invalid Email/Password."
            });
        }

    } catch (err) {
        console.log(err);
        return next({
            status: 400,
            message: "Invalid Email/Password."
        });
    }
}

exports.getUser = async function (req, res, next) {

    try{
        const user = await db.Users.findOne({
                    uuid: req.params.userUuid
                })
                .select(userSelectFilter);
        
        return res.status(200).json(user);
    }
    catch(err){
        console.log(err);
    }
}

exports.updateUser = async function (req, res, next) {

     const user = await db.Users.findOneAndUpdate({
                uuid: req.params.userUuid
            },
            req.body);

    return res.status(200).json(user);
}

exports.addAchievementToUser = async function (req, res, next) {

    try{
        const user = await db.Users.findOne({
            uuid: req.params.userUuid
        });

        const achievement = await db.Achievements.findOne({
            uuid: req.body.achievementUuid
        });

        if(user == undefined || achievement == undefined){
            return next({
                status: 401,
                message: "Invalid arguments"
            }); 
        }

        user.achievements.push(user._id);
        achievement.users.push(user._id);

        user.save(function (err) {
            if (err) return console.log(err);
        });

        achievement.save(function (err){
            if(err) console.log(err);
        });

        return res.status(200).json(user);
    }
    catch(err){
        console.log(err);
    }
}
