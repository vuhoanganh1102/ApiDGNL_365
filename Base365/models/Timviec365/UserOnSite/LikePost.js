const mongoose = require('mongoose');
const LikePostSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    idNew: {
        // ID tin tuyển dụng
<<<<<<< HEAD
        type: String,
=======
        type: Number,
>>>>>>> fbd89e45e8aa5f334543c57bdbc3952f995e6833
    },
    type: {
        // 1 là like, 2 là tim, 3 là ngạc nhiên, 4 là cười trái tim, 5 là phẫn nộ, 6 là khóc, 7 là haha, 8 là chia sẻ
        type: Number
    },
    idCommentLike: {
        // ID của comment mà được thả cảm xúc
<<<<<<< HEAD
        type: String,
=======
        type: Number,
>>>>>>> fbd89e45e8aa5f334543c57bdbc3952f995e6833
        default: 0
    },
    idUserLike: {
        // ID tìm việc
<<<<<<< HEAD
        type: String,
=======
        type: Number,
>>>>>>> fbd89e45e8aa5f334543c57bdbc3952f995e6833
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