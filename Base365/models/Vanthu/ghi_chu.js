const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ghi_chu = new Schema({
    id_note : {
        type : Number,
        required : true
    },
    id_vb : {
        type : Number,
        default: null
    },
    text_note : {
        type : String
    }

})
module.exports = mongoose.model("ghi_chu", ghi_chu);