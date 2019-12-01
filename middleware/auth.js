require("dotenv");
const db = require("../models");
const jwt = require("jsonwebtoken");

exports.loginRequired = function (req, res, next) {

    try {

        if(req.headers.authorization == undefined)
            return next({
                status: 400,
                message: "Authentication token required"
            });


        const token = req.headers.authorization//.split(" ")[1];
        console.log(token)
        jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (decoded) {
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
        return next({
            status: 500,
            message: "An error occurred"
        });
    }

};

exports.adminLoginRequired = async function(req, res, next){
    try {

        if(req.headers.authorization == undefined)
            return next({
                status: 400,
                message: "Authentication token required"
            });

        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (decoded 
                && decoded.username == process.env.ADMIN_USERNAME 
                && decoded.admin){
                    console.log("DECODED "+decoded);
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


exports.ensureSelfOrAdmin = async function(req, res, next){
    
    // Check if request author non-admin is accessing his details
    if(!req.user.admin){
        const author = await db.Users.findOne({
                uuid: req.user.uuid
            })

        if(author.uuid != req.params.userUuid)
            return next({
                status: 403,
                message: "Forbidden"
            }); 
    }

    return next();
}