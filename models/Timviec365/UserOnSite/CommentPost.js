const mongoose = require('mongoose');
const CommentPostSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    urlCm: {
        type: String,
    },
    parentCmId: {
        type: Number
    },
    comment: {
        type: String,
    },
    commentName: {
        type: String,
    },
    commentAvatar: {
        type: String,
    },
    image: {
        type: String,
    },
    ipComment: {
        type: String,
    },
    tag: {
        type: String,
    },
    timeComment: {
        type: Date,
    },
}, {
    collection: 'CommentPost',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("CommentPost", CommentPostSchema);