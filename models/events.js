const mongoose = require("mongoose");

const eventsSchema = new mongoose.Schema(
    {
        uuid: {
            type: String,
            required: true
        },       
        type: {
            type: String,
            enum: ['workshop', 'other'],
            required: true
        },
        name: {
            type: String,
            required: false
        },
        limit: {
            type: Number,
            required: false,
            default: Number.MAX_SAFE_INTEGER
        },
        users: [ {
                type: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Users'
                }
                
            }
        ]
    }
);

const Events = mongoose.model("Events", eventsSchema);

module.exports = Events;