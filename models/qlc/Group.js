const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    //ID của nhóm
    _id: {
        type: Number,
        required: true
    },

    //ID tổ của nhóm
    teamId: {
        type: Number,
    },

    // Tên của nhóm
    groupName: {
        type: String,
    },

    //Ngày thành lập nhóm
    groupCreated: {
        type: Date,
        default: Date.now()
    },

    //ID quản lý nhóm
    managerId: {
        type: Number
    },

    //Sắp xếp theo thứ tự
    groupOrder: {
        type: Number
    }
})

module.exports = mongoose.model('Groups', GroupSchema)