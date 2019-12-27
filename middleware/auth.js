require("dotenv");
const db = require("../models");
const jwt = require("jsonwebtoken");

exports.loginRequired = async function (req, res, next) {
    try {
        if (req.headers.authorization == undefined)
            return next({
                status: 400,
                message: "Authentication token required"
            });

        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, async function (err, decoded) {
            if (decoded) {
                
                if(!decoded.admin){
                    const user = await db.Users.findOne({
                        email: decoded.email,
                        uuid: decoded.uuid
                    });

                    if (!user) {
                        return next({
                            status: 404,
                            message: "Invalid authentication token"
                        });
                    }

                    user.admin = false;
                    req.user = user;
                    return next();
                }
                else{
                    req.user = decoded;
                    return next();
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

exports.adminLoginRequired = async function (req, res, next) {
    try {

        if (req.headers.authorization == undefined)
            return next({
                status: 400,
                message: "Authentication token required"
            });

        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (decoded
                && decoded.username == process.env.ADMIN_USERNAME
                && decoded.admin) {
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

    console.log(req.user);
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