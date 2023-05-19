const mongoose = require('mongoose');
const DonUVSchema = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    userId: {
        type: Number
    },
    donId: {
        type: Number
    },
    lang: {
        type: String
    },
    html: {
        type: String
    },
    nameImg: {
        type: String
    },
    status: {
        type: Number
    }
}, {
    collection: 'DonUV',
    versionKey: false
});

module.exports = mongoose.model('DonUV', DonUVSchema);