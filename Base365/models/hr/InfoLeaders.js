const mongoose = require('mongoose');
const HR_InfoLeaderSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    epId: {
        type: Number,
        required: true,
    },
    avatar: {
        type: String,
        default:null
    },
    description: {
        type: String,
        required: true,
    },
    desPosition: {
        type: String,
    },
    created_at: {
        type: Date,
    },
    updated_at: {
        type: Date,
    },
}, {
    collection: 'HR_InfoLeaders',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("HR_InfoLeaders", HR_InfoLeaderSchema);