const mongoose = require('mongoose');
const pointUsedSchema = new mongoose.Schema({
    _id: {
        type: Number,
    },
    uscID: {
        type: Number,
    },
    useID: {
        type: Number,
    },
    point: {
        type: Number,
    },
    type: {
        type: Number,
    },
    typeErr: {
        type: Number,
        default: 0
    },
    noteUV: {
        type: String,
        default: null
    },
    usedDay: {
        type: Date,
        default: Date()
    },
    returnPoint: {
        type: Number,
    },
    adminID: {
        type: Number,
        default: 0
    },
    ipUser: {
        type: String,
    },
}, {
    collection: 'PointUsed',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("PointUsed", pointUsedSchema);