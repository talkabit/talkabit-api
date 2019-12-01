const db = require("../models");
const uuidv1 = require('uuid/v1');
const bcrypt = require("bcrypt");
const hash = require('hash.js')
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const jwtOptions = {
    expiresIn: "1h"
}
const ms = require('ms');
const QRCode = require('qrcode');

const userSelectFilter = "-__v -_id -password -banned -achievements.__v -achievements._id -achievements.users -events._id -events.__v -events.users";

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

exports.registerUser = async function (req, res, next) {

    try {

        const user = await db.Users.findOne({
                    email: req.body.email,
                    orderId: req.body.orderId
                });

        if(user == undefined)
            return next({
                status: 401,
                message: "Invalid email or order id"
            });

        if(user.isPasswordSet())
            return next({
                status: 403,
                message: "Already registered"
            });

        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        user.password = hashedPassword;
        QRCode.toString(user.uuid, (err, string) => {
            if (err) throw err
            user.qr = string;
            user.save();
          })

        const { uuid, email } = user;
        const token = jwt.sign({
            uuid,
            email
        }, process.env.SECRET_KEY, jwtOptions);

        const expiresAt = new Date(Date.now()+ms(jwtOptions.expiresIn));

        return res.status(200).json({
            uuid, token, expiresAt
        });
        
    } catch (err) {
        return next({
            status: 500,
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
        	return next({
                status: 400,
                message: "Invalid credentials"
            });

        if(user.banned)
            return next({
                status: 403,
                message: "Forbidden"
            });

        const { uuid, name } = user;
        const isMatch = await user.comparePassword(req.body.password);

        if (isMatch) {

            const token = jwt.sign({
                uuid, name
            }, process.env.SECRET_KEY);

            const expiresAt = new Date(Date.now()+ms(jwtOptions.expiresIn));

            return res.status(200).json({
                uuid, token, expiresAt
                
            });
        }
        else
            return next({
                status: 400,
                message: "Invalid credentials"
            });

    } catch (err) {
        console.log(err);
        return next({
            status: 500,
            message: err.message
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

            const expiresAt = new Date(Date.now()+ms(jwtOptions.expiresIn));

            return res.status(200).json({
                token, expiresAt
            });
        }
        else
            return next({
                status: 400,
                message: "Invalid credentials"
            });

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
                .populate('events')
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
                .populate('events')
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

        if(!user.achievements.includes(achievement._id)){
            user.achievements.push(achievement._id);
	        achievement.users.push(user._id);

	        await user.save();
	        await achievement.save();
        }
        
        return res.sendStatus(200);
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
                status: 400,
                message: "Invalid arguments"
            }); 
        }

        if(event.isFull()){
            return next({
                status: 400,
                message: "Event is full"
            });
        }

        if(!user.events.includes(event._id)){
            user.events.push(event._id);
            event.users.push(user._id);

            await user.save();
            await event.save();
        }

        return res.sendStatus(200);
    }
    catch(err){
        console.log(err);
    }
}
