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
	    orderId: {
	        type: Number,
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
	    scanned: {
	        type: [{
	            type: mongoose.Schema.Types.ObjectId,
	            ref: 'Users'
	        }],
	        default: []
	    },
	    banned: {
	    	type: Boolean,
	    	default: false
		},
		qr: {
			type:String,
			default: null,
			required: false
		}
    },
    {
        timestamps: true
    }
);


userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;

    } catch(err) {
        return false;
    }
}

userSchema.methods.isPasswordSet = function() {
    return this.password != undefined;
}

const Users = mongoose.model("Users", userSchema);

module.exports = Users;