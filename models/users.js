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
	        required: true
	    },
	    username: {
	        type: String,
	        required: true,
	        unique: true
	    },
	    password: {
	        type: String,
	        required: true
	    },
	    achievements: {
	        type: [{
	            type: mongoose.Schema.Types.ObjectId,
	            ref: 'Achievements'
	        }],
	        default: []
	    },
	    // achievements: {
	    //     type: [{
	    //         uuid: String,
	    //         acquired: {
	    //             type: Date,
	    //             default: Date.now
	    //         }
	    //     }],
	    //     default: []
	    // },
	    dinner: {
	    	type: String,
	    	required: false
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

const Users = mongoose.model("User", userSchema);

module.exports = Users;