const mongoose = require("mongoose");

mongoose.set("debug", true);

mongoose.Promise = Promise;

const DB_CONNECTION = process.env.DB_CONNECTION || "mongodb://localhost:27017/tab";
mongoose.connect(DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports.Keys = require("./keys");
module.exports.Users = require("./users");
module.exports.Achievements = require("./achievements");
module.exports.Events = require("./events");
