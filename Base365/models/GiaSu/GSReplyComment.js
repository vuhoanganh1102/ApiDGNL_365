
const mongoose = require("mongoose");
const gs_reply_comment = new mongoose.Schema({

    rep_comment_id : {
        type : Number,
        required: true,

    },
    gs_comment_id : {
        type : Number,

    },
    gs_userteach_id : {
        type : Number,

    },
    gs_userparent_id : {
        type : Number,

    },
    comment_reply : {
        type : String,

    },
    time_comment_rep : {
        type : Date,
        default : new Date()
    },

}, {
    collection: "GS_gs_reply_comment",
    versionKey: false,
}
);
module.exports = mongoose.model("GS_gs_reply_comment", gs_reply_comment);