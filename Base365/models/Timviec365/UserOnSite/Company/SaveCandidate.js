const mongoose = require('mongoose');
const saveCandidateSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },

    uscID: {
        // id company
        type: Number,
        default: 0
    },

    userID: {
        //id  ứng viên
        type: Number,
        default: 0
    },

    saveTime: {
        // thời gian lưu
        type: Date,
        default: null
    }
}, {
    collection: 'SaveCandidate',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("SaveCandidate", saveCandidateSchema);