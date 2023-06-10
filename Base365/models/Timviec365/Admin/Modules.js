const mongoose = require('mongoose');
const moduleSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        default: null
    },
    path: {
        type: String,
        default: null
    },
    listName: {
        type: String,
        default: null
    },
    listFile: {
        type: String,
        default: null
    },
    order: {
        type: String,
        default: null
    },
    help: {
        type: String,
        default: null
    },
    langID: {
        type: Number,
        default: 1
    },
    checkLoca: {
        type: Number,
        default: 0
    }
}, {
    collection: 'Modules',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Modules", moduleSchema);