const mongoose = require('mongoose');
const HR_DescPositionSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    positionId: {
        type: Number,
        required: true,
    },
    comId: {
        type: Number,
        required: true,
    },
    description	: {
        type: String,
        required: true,
    }
}, {
    collection: 'HR_DescPositions',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("HR_DescPositions", HR_DescPositionSchema);