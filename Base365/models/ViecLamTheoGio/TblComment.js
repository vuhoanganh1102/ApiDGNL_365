const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TblCommentSchema = new Schema({
    cm_id: {
        type: Number,
        required: true,
    },
    url_cm: {
        type: String,
        default: null,
    },
    parent_cm_id: {
        type: Number,
        default: 0,
    },
    comment: {
        type: String,
        default: null,
    },
    comment_sender_name: {
        type: String,
        default: null,
    },
    ip_cm: {
        type: String,
        default: null,
    },
    time_cm: {
        type: Number,
        default: 0,
    },
    reply: {
        type: Number,
        default: 0,
    }
},{
    collection: 'VLTH_TblComment',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("VLTH_TblComment",TblCommentSchema);
