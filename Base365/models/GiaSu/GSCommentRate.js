const mongoose = require("mongoose");
const gs_comment_rate = new mongoose.Schema({

    comment_rate_id : {
        type : Number,
        required: true,
        unique: true,
        autoIncrement: true

    },
    gs_userteach_id : {
        type : Number,

    },
    gs_userparent_id : {
        type : Number,

    },
    rate : {
        type : Number,

    },
    comment_content : {
        type : String,

    },
    time_comment : {
        type : Date,
        default : new Date()

    },

}, {
    collection: "GS_gs_comment_rate",
    versionKey: false,
}
);
module.exports = mongoose.model("GS_gs_comment_rate", gs_comment_rate);