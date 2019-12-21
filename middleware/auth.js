require("dotenv");
const db = require("../models");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

exports.loginRequired = function (req, res, next) {
    try {
        if (req.headers.authorization == undefined)
            return next({
                status: 400,
                message: "Authentication token required"
            });

        const token = req.headers.authorization;
        jwt.verify(token, process.env.SECRET_KEY, async function (err, decoded) {
            if (decoded) {
                let user = await db.Users.findOne({
                    email: decoded.email,
                    uuid: decoded.uuid
                });
                if (user) {
                    req.user = user;
                    return next();
                } else {
                    return next({
                        status: 404,
                        message: "Invalid authentication token"
                    });
                }
            }
            else {
                return next({
                    status: 401,
                    message: "Invalid authentication token"
                });
            }
        });
    } catch (err) {
        return next({
            status: 500,
            message: "An error occurred"
        });
    }
};

exports.debugKey = function (req, res, next) {
    try{
        if(req.body.debug_key == null || crypto.createHash('sha256').update(req.body.debug_key).digest('base64') != "35Y/8LrkS7gFOzxpAqv+pI68QrkYYGAcm6X6DJwLOXM="){
            return next({
                status: 401,
                message: "Unauthorized (needs debug key - ask devs)"
            });
        }else{
            return next();
        }
    }catch (err){
        return next({
            status: 401,
            message: "Unauthorized (needs debug key - ask devs)"
        });
    }
}

exports.adminLoginRequired = async function (req, res, next) {
    try {

        if (req.headers.authorization == undefined)
            return next({
                status: 400,
                message: "Authentication token required"
            });

        const token = req.headers.authorization;
        jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (decoded
                && decoded.username == process.env.ADMIN_USERNAME
                && decoded.admin) {
                console.log("DECODED " + decoded);
                req.user = decoded;
                return next();
            }
            else {
                return next({
                    status: 401,
                    message: "Invalid authentication token"
                });
            }
        });

    } catch (err) {
        console.log(err);
        return next({
            status: 500,
            message: "An error occurred"
        });
    }
}


exports.ensureSelfOrAdmin = async function (req, res, next) {

    // Check if request author non-admin is accessing his details
    if (!req.user.admin) {
        const author = await db.Users.findOne({
            uuid: req.user.uuid
        })

        if (author.uuid != req.params.userUuid)
            return next({
                status: 403,
                message: "Forbidden"
            });
    }

    return next();
}