const mongoose = require('mongoose');
const TV365GhimHistorySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["1", "4", "5", "6", null],
        default: null
    },
    created_time: {
        type: Number,
        default: 0
    },
    ghim_start: {
        type: Number,
        default: 0
    },
    ghim_end: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number,
        default: 0
    },
    //1 is active, 0 is disabled
    status: {
        type: Number,
        default: 1
    },
    bg_id: {
        type: String,
        default: null
    },
    new_id: {
        type: Number,
        default: null
    }
}, {
    collection: 'TV365GhimHistory',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("TV365GhimHistory", TV365GhimHistorySchema);