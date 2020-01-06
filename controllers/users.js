const db = require("../models");
const filters = require('./filters');
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
const NodeRSA = require('node-rsa');

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
        user.qr = await QRCode.toDataURL(`https://talkabit.org/pages/cv?uuid=${user.uuid}`);
        user.save();

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

        const { uuid, email } = user;
        const isMatch = await user.comparePassword(req.body.password);

        if (isMatch) {

            const token = jwt.sign({
                uuid, email, admin: false
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

    const selectFilter = req.user.admin ? "adm" : "usr";
    try{
        const user = await db.Users.find()
                .populate({
                    path: 'achievements',
                    select: filters[selectFilter].achievementAdminFilter
                })
                .populate({
                    path: 'events',
                    select: filters[selectFilter].eventAdminFilter
                })
                .select(filters[selectFilter].userAdminFilter);
        
        return res.status(200).json(user);
    }
    catch(err){
        console.log(err);
    }
}

exports.getUser = async function (req, res, next) {

    const selectFilter = req.user.admin ? "adm" : "usr";
    try{
        const user = await db.Users.findOne({
                    uuid: req.params.userUuid
                })
                .populate({
                    path: 'achievements',
                    select: filters[selectFilter].achievementFilter
                })
                .populate({
                    path: 'events',
                    select: filters[selectFilter].eventFilter
                })
                .select(filters[selectFilter].userFilter);

        
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
            req.body, {new: true})
            .select(`${filters.usr.userFilter} -achievements -events`);

    return res.status(200).json(user);
}

exports.addScannedUser = async function (req, res, next) {

    try{

        const scannedUser = await db.Users.findOne({
            uuid: req.body.scannedUserUuid
        });

        const user = await db.Users.findOne({
            uuid: req.params.userUuid
        });

        if(user == undefined || scannedUser == undefined){
            return next({
                status: 400,
                message: "Invalid arguments"
            }); 
        }

        if(!user.scanned.includes(scannedUser._id)
            && user.uuid != scannedUser.uuid){
            user.scanned.push(scannedUser._id);
            await user.save();
        }
        
        return res.sendStatus(200);
    }
    catch(err){
        return next({
            status: 500,
            message: "Error registering scan"
        }); 
    }
}

exports.addAchievementToUser = async function (req, res, next) {

    try{

        let decryptedAchievementUuid = null;

        try{
            const tabKey = await db.Keys.findOne();

            const key = new NodeRSA(tabKey.public);
            key.setOptions({
                encryptionScheme: 'pkcs1',
            });
            const buf = Buffer.from(req.body.achievementUuid, 'hex');
            console.log(buf);
            decryptedAchievementUuid = key.decryptPublic(buf).toString();
        }
        catch(e){
            return next({
                status: 400,
                message: "Invalid achievement id"
            }); 
        }

        const achievement = await db.Achievements.findOne({
            uuid: decryptedAchievementUuid
        });

        const user = await db.Users.findOne({
            uuid: req.params.userUuid
        });

        if(user == undefined || achievement == undefined){
            return next({
                status: 400,
                message: "Invalid arguments"
            }); 
        }

        if(!user.achievements.includes(achievement._id)){
            user.achievements.push(achievement._id);
	        await user.save();
        }

        if(!achievement.users.includes(user._id)){
            achievement.users.push(user._id);
            await achievement.save();
        }
        
        return res.sendStatus(200);
    }
    catch(err){
        return next({
            status: 500,
            message: "Error adding achievement"
        }); 
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

        if(event.type == 'cvreq'){
            if(user.cv == undefined || user.cv == null)
                return next({
                    status: 400,
                    message: "CV must be set to attend this event"
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
            await user.save();
        }

        if(!event.users.includes(user._id)){
            event.users.push(user._id);
            await event.save();
        }

        return res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        return next({
            status: 500,
            message: "Error adding event"
        }); 
    }
}


exports.removeEventFromUser = async function (req, res, next) {

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

        user.events = user.events.filter( e => !e._id.equals(event._id) );
        await user.save();

        event.users = event.users.filter( u => !u._id.equals(user._id) );
        await event.save();

        return res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        return next({
            status: 500,
            message: "Error removing event"
        }); 
    }
}