const mongoose = require("mongoose");

const keysSchema = new mongoose.Schema(
    {
        public: {
            type: String,
            required: true
        },
        private: {
            type: String,
            required: true
        }
    }
);

const Keys = mongoose.model("Keys", keysSchema);

module.exports = Keys;