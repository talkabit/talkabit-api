const mongoose = require("mongoose");
const QRCode = require('qrcode');
const NodeRSA = require('node-rsa');
const db = require("../models");

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
        description: {
            type: String,
            required: false,
        },
        users: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            }],
            default: []
        },
        qr: {
            type: String,
            required: false
        },
        available: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    {
        timestamps: true
    }
);

achievementsSchema.pre("save", async function(next){
    this.qr = await QRCode.toString(`http://talkabit.org/achievement?id=${this.uuid}`);
    next();
});

const Achievements = mongoose.model("Achievements", achievementsSchema);

module.exports = Achievements;