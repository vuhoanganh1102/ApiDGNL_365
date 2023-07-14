const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Com_error = new Schema({
    //loi dang ki cty
    
    id : {
        type: Number,

    },
    com_email : {
        type: String,

    },
    com_phone : {
        type: String,

    },
    com_name : {
        type: String,

    },
    com_address : {
        type: String,

    },
    com_pass : {
        type: String,
 

    },
    com_time_err : {
        type: Number,
        default : 0
    },

});

module.exports = mongoose.model("QLC_Com_error", Com_error);