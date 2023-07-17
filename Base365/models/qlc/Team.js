const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    //ID của tổ
    team_id: {
        type: Number,
        required: true
    },
    //ID phòng ban của tổ
    dep_id: {
        type: Number,
    },

    com_id: {
        type : Number,
    },
    //Tên của tổ
    teamName: {
        type: String,
    },
    //Ngày thành lập tổ
    createdAt: {
        type: Date,
        default: Date.now()
    },
    //Sắp xếp theo thứ tự
    teamOrder: {
        type: Number
    },

})

module.exports = mongoose.model('QLC_Teams', TeamSchema)