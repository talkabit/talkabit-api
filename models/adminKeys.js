const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminKeysSchema = new mongoose.Schema(
	{
	    password: {
	        type: String,
	        required: true
	    }
);


adminKeysSchema.methods.comparePassword = async function(candidatePassword, next) {
    try {

        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;

    } catch(err) {
        return next(err);
    }
}

const User = mongoose.model("User", userSchema);

module.exports = User;