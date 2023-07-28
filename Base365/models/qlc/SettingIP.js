const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SetIPShema = new mongoose.Schema({
    id_acc: { // id cài đặt ip
        type: Number,
        require: true
    },
    id_com: { // id công ty
        type: Number,
    },
    ip_access: { //địa chỉ ip
        type: String,
    },
    from_site: { // site cài IP 
        type: String,
    },
    created_time: {
        type: Number,
        default: 0
    },
    update_time: {
        type: Number,
        default: 0
    }
}, {
    collection: 'QLC_AccessIP',
    versionKey: false,
    timestamp: true
});
module.exports = mongoose.model('QLC_AccessIP', SetIPShema)