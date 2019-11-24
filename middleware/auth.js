require("dotenv");
const jwt = require("jsonwebtoken");

exports.loginRequired = function (req, res, next) {

    try {

        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (decoded) {
                req.user = decoded;
                return next();
            }
            else {
                return next({
                    status: 401,
                    message: "Please log in first."
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

exports.adminLogin = async function(req, res, next){
    const password = req.body.password;
    const isMatch = await bcrypt.compare(candidatePassword, this.password);

    if(isMatch)
        return next();
    else
        return next({
            status: 401,
            message: "Unauthorized"
        })
}
