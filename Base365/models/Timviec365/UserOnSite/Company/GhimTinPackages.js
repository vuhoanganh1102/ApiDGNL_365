const mongoose = require('mongoose');
const Tv365GhimTinPackagesSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number,
        default: 0
    }   
}, {
    collection: 'Tv365GhimTinPackages',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365GhimTinPackages", Tv365GhimTinPackagesSchema);