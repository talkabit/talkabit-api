const db = require("../models");
const uuidv1 = require('uuid/v1');
const bcrypt = require("bcrypt");
const hash = require('hash.js')
const axios = require('axios');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const jwtOptions = {
    expiresIn: "1h"
}

const userSelectFilter = "-__v -_id -password";

exports.createUser = async function (req, res, next) {

    try {

        // const response = await axios.get(
        //         req.body.eventBriteUrl, 
        //         {
        //             headers: {
        //                 Authorization: 'Bearer ',
        //                 'Content-Type': 'application/json'
        //             }
        //         }
        //     );

        // console.log(response.data);

        // resp = uuidv1();
        // const user = await db.Users.create(req.body);

        return res.status(201).json({});
        
    } catch (err) {

        return next({
            status: 400,
            message: err.message
        });

    }
}

exports.registerUser = async function (req, res, next) {

    try {

        const user = await db.Users.findOne({
                    email: req.body.email,
                    ticketId: req.body.ticketId
                });

        if(user == undefined)
            return next({
                status: 400,
                message: "Missing user"
            });

        if(user.isPasswordSet())
            return next({
                status: 400,
                message: "Already registered"
            });

        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        req.body.password = hashedPassword;
        user.password = hashedPassword;
        user.name = req.body.name;
        user.username = username;

        user.save(function (err) {
            if (err) return console.log(err);
        });

        const { uuid } = user;

        const token = jwt.sign({
            uuid,
            name
        }, process.env.SECRET_KEY, jwtOptions);

        return res.status(200).json({
            uuid, name, token
        });
        
    } catch (err) {

        if (err.code === 11000) {
            err.message = "Sorry, that username is taken";
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
            throw "Invalid credentials";

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
                message: "Invalid credentials"
            });
        }

    } catch (err) {
        console.log(err);
        return next({
            status: 400,
            message: "Invalid credentials"
        });
    }
}

exports.loginAdmin = async function (req, res, next) {

    try {

        const pwd = req.body.password+process.env.ADMIN_PASSWORD_SALT;
        const hashedPwd = hash.sha256().update(pwd).digest('hex');

        if(hashedPwd == process.env.ADMIN_PASSWORD) {

            const token = jwt.sign({
                username: process.env.ADMIN_USERNAME, 
                admin: true
            }, process.env.SECRET_KEY);

            return res.status(200).json({
                token
            });
        }
        else {
            return next({
                status: 400,
                message: "Invalid credentials"
            });
        }

        return res.status(200).json({});s

    } catch (err) {
        console.log(err);
        return next({
            status: 400,
            message: "Invalid Email/Password."
        });
    }
}

exports.getUsers = async function (req, res, next) {

    try{
        const user = await db.Users.find()
                .populate('achievements')
                .select(userSelectFilter);
        
        return res.status(200).json(user);
    }
    catch(err){
        console.log(err);
    }
}

exports.getUser = async function (req, res, next) {

    try{
        const user = await db.Users.findOne({
                    uuid: req.params.userUuid
                })
                .populate('achievements')
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

        user.achievements.push(achievement._id);
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

exports.addEventToUser = async function (req, res, next) {

    try{
        const user = await db.Users.findOne({
            uuid: req.params.userUuid
        });

        const event = await db.Events.findOne({
            uuid: req.body.eventUuid
        });

        if(user == undefined || event == undefined){
            return next({
                status: 401,
                message: "Invalid arguments"
            }); 
        }

        if(event.isFull()){
            return next({
                status: 400,
                message: "Event is full"
            });
        }

        user.events.push(event._id);
        event.users.push(user._id);

        user.save(function (err) {
            if (err) return console.log(err);
        });

        event.save(function (err){
            if(err) return console.log(err);
        });

        return res.status(200).json(user);
    }
    catch(err){
        console.log(err);
    }
}
