const mongoose = require("mongoose");

const achievementsSchema = new mongoose.Schema(
    {
        uuid: {
            type: String,
            required: true
        },        
        type: {
            type: String,
            enum: [ 'workshop', 'social', 'talks' ],
            required: true
        },
        name: {
            type: String,
            required: false,
            unique: true
        },
        users: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            }],
            default: []
        }
    },
    {
        timestamps: true
    }
);

const Achievements = mongoose.model("Achievements", achievementsSchema);

module.exports = Achievements;