const mongoose = require('mongoose');
const HR_CiSessionSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
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