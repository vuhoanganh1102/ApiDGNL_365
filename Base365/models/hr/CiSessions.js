const mongoose = require('mongoose');
const HR_CiSessionSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    ipAddress: {
        type: String,
        required: true,
    },
    timestamp : {
        type: Date,
        required: true,
        default: 0,
    },
    data: {
        type: Buffer,
        required: true,
    },
}, {
    collection: 'HR_CiSessions',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("HR_CiSessions", HR_CiSessionSchema);