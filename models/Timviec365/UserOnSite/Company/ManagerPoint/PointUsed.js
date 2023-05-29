const mongoose = require('mongoose');
const pointUsedSchema = new mongoose.Schema({
    _id: {
        type: Number,
    },
    uscID: {
        type: Number,
        default: 0
    },
    useID: {
        type: Number,
        default: 0
    },
    point: {
        type: Number,
        default: 0
    },
    type: {
        type: Number,
        default: 0
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
        default: null
    },
    returnPoint: {
        type: Number,
        default: null

    },
    adminID: {
        type: Number,
        default: 0
    },
    ipUser: {
        type: String,
        default: null
    },
}, {
    collection: 'PointUsed',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("PointUsed", pointUsedSchema);