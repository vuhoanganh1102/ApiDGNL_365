const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CalendarSchema = new Schema({
    //Id lịch làm việc
    
    cy_id : {
        type: Number,

    },
    com_id : {
        type: Number,

    },
    cy_name : {
        type: String,

    },
    apply_month : {
        type: Number,

    },
    cy_detail : {
        type: String,

    },
    status : {
        type: Number,

    },
    is_personal : {
        type: Number,

    },

});

module.exports = mongoose.model("QLC_Cycle", CalendarSchema);