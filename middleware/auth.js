require("dotenv");
const jwt = require("jsonwebtoken");

exports.loginRequired = function (req, res, next) {

    try {


        if(req.headers.authorization == undefined)
            return next({
                status: 401,
                message: "Token required"
            });


        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (decoded) {
                req.user = decoded;
                return next();
            }
            else {
                return next({
                    status: 401,
                    message: "Please log in first"
                });
            }
        });

    } catch (err) {
        return next({
            status: 401,
            message: "An error occurred"
        });
    }

};

exports.adminLoginRequired = async function(req, res, next){
    try {

        if(req.headers.authorization == undefined)
            return next({
                status: 401,
                message: "Token required"
            });

        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (decoded 
                && decoded.username == process.env.ADMIN_USERNAME 
                && decoded.admin)
                    return next();
            else {
                return next({
                    status: 401,
                    message: "Please log in first"
                });
            }
        });

    } catch (err) {
        console.log(err);
        return next({
            status: 401,
            message: "An error occurred"
        });
    }
}
