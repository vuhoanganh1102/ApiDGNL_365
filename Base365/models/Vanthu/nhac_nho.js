const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nhac_nho = new Schema({
    id_nhac_nho : {
        type : Number
    },
    id_dx : {
        type : Number
    },
    time_dx : {
        type : Date
    }
})
module.exports = mongoose.model("nhac_nho", nhac_nho)