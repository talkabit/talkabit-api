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
        }
    },
    {
        timestamps: true
    }
);

achievementsSchema.pre("save", async function(next){
    const encUuid = await encrypt(this.uuid);
    console.log(encUuid);
    const content = `http://talkabit.org/achievement?id=${encUuid}`;
    let imgSrc = await QRCode.toDataURL(content);
    this.qr = imgSrc;
    next();
});

async function encrypt(msg){
    const tabKey = await db.Keys.findOne();

    const key = new NodeRSA(tabKey.private);
    key.setOptions({
        encryptionScheme: 'pkcs1',
    });
    const encMsg = key.encryptPrivate(msg, 'base64');
    console.log(msg.length+" "+encMsg.length);
    console.log(encMsg);
    return encMsg;
}

const Achievements = mongoose.model("Achievements", achievementsSchema);

module.exports = Achievements;