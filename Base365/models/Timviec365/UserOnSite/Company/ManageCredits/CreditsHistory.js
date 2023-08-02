const mongoose = require('mongoose');
const CreditsHistorySchema = new mongoose.Schema(
    {
        //idTimViec365
        usc_id: {
            type: Number,
            default: 0
        },
        use_id: {
            type: Number,
            default: 0  
        },
        amount: {
            type: Number,
            default: 0
        },
        /**
         * Loại lịch sử: 
         * - 0: Sử dụng
         * - 1: Nạp tiền
         * - 2: Đổi từ điểm uy tín
         */
        type: {
            type: Number,
            default: 0
        },
        used_day: {
            type: Number,
            default: 0
        },
        //ID của admin nạp tiền
        admin_id: {
            type: Number,
            default: -1
        },
        ip_user: {
            type: String,
            default: null
        },
    },
    {
        collection: "Tv365CreditsHistory"
    })
module.exports = mongoose.model("Tv365CreditsHistory", CreditsHistorySchema);