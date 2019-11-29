const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
	{
	    uuid: {
	        type: String,
	        required: true
	    },
	    name: {
	        type: String,
	        required: true
	    },
	    email: {
	        type: String,
	        required: true,
	        unique: true
	    },
	    username: {
	        type: String,
	        required: false,
	        unique: true
	    },
	    ticketId: {
	        type: String,
	        required: true,
	        unique: true
	    },
	    password: {
	        type: String,
	        required: false
	    },
	    achievements: {
	        type: [{
	            type: mongoose.Schema.Types.ObjectId,
	            ref: 'Achievements'
	        }],
	        default: []
	    },
	    events: {
	        type: [{
	            type: mongoose.Schema.Types.ObjectId,
	            ref: 'Events'
	        }],
	        default: []
	    },
	    cv: {
	    	type: String,
	    	required: false
	    },
	    banned: {
	    	type: Boolean,
	    	default: false
	    }
    },
    {
        timestamps: true
    }
);


userSchema.methods.comparePassword = async function(candidatePassword, next) {
    try {

        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;

    } catch(err) {
        return next(err);
    }
}

userSchema.methods.isPasswordSet = function() {
    return this.password != undefined;
}

const Users = mongoose.model("User", userSchema);

module.exports = Users;