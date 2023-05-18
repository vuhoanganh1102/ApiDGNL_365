const mongoose = require('mongoose');
const userSavePostSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    userID: {
        type: Number,
        required: true
    },
    newID: {
        type: Number,
        default: 0
    },
    saveTime: {
        type: Date,
        required: true
    }
}, {
    collection: 'UserSavePost',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("UserSavePost", userSavePostSchema);