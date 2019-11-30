const db = require("../models");
const axios = require("axios")
const uuidv1 = require('uuid/v1');

exports.addUser = async function (req, res, next) {
    try {

        const response = await axios.get(
                req.body.apiUrl,
                {
                    headers: {
                        Authorization: 'Bearer '+process.env.EVENTBRITE_KEY,
                        'Content-Type': 'application/json'
                    }
                }
            );

        console.log(response.data);

        let userInfo = {
            email: response.data.email,
            name: response.data.name,
            orderId: response.data.id,
            uuid: uuidv1()
        }

        const user = await db.Users.create(userInfo);

        return res.status(201).json(user);
        
    } catch (err) {

        if (err.code === 11000) {
            err.message = "Duplicated info";
        }

        return next({
            status: 500,
            message: err.message
        });
    }
    
}