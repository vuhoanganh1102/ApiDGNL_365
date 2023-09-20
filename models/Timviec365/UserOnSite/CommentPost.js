const mongoose = require('mongoose');
const CommentPostSchema = new mongoose.Schema({
    cm_id: {
        type: Number,
        required: true,
        unique: true
    },
    cm_url: {
        type: String,
        default: null
    },
    cm_new_id: {
        type: Number,
        default: 0
    },
    cm_sender_idchat: {
        type: Number
    },
    cm_parent_id: {
        type: Number
    },
    cm_comment: {
        type: String,
        default: null
    },
    cm_img: {
        type: String,
        default: null
    },
    cm_ip: {
        type: String,
        default: null
    },
    cm_tag: {
        type: String,
        default: null
    },
    cm_time: {
        type: Number,
        default: 0
    },
}, {
    collection: 'Tv365CommentPost',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("Tv365CommentPost", CommentPostSchema);