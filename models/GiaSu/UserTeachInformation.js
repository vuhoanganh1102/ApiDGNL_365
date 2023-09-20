
const mongoose = require("mongoose");
const user_teach_information = new mongoose.Schema({

    ugs_ti : {
        type : Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    ugs_id : {
        type : Number,
    },
    ugs_formality : {
        type : String,
        default : null,
    },
    ugs_unit_price : {
        type : Number,
        default : null,
    },
    ugs_time : {
        type : String,
        default : null,
    },
    ugs_salary : {
        type : String,
        default : null,
    },
    ugs_month : {
        type : String,
        default : null,
    },

}, {
    collection: "GS_user_teach_information",
    versionKey: false,
}
);
module.exports = mongoose.model("GS_user_teach_information", user_teach_information);