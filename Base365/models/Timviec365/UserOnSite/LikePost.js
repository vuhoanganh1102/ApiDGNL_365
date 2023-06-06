const mongoose = require('mongoose');
const LikePostSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    idNew: {
        // ID tin tuyển dụng
        type: Number,
    },
    type: {
        // 1 là like, 2 là tim, 3 là ngạc nhiên, 4 là cười trái tim, 5 là phẫn nộ, 6 là khóc, 7 là haha, 8 là chia sẻ
        type: Number
    },
    idCommentLike: {
        // ID của comment mà được thả cảm xúc
        type: Number,
        default: 0
    },
    idUserLike: {
        // ID tìm việc
        type: Number,
    },
    IPLike: {
        type: String
    },
    timeComment: {
        type: Date,
    },
}, {
    collection: 'LikePost',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("LikePost", LikePostSchema);