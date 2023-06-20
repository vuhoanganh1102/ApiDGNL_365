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

    //ID phong của nhóm
    depId: {
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

    //ID pho quan ly nhom
    deputyManagerId: {
        type: Number
    },

    //so luong thanh vien
    numberMember: {
        type: Number,
        default: 0
    },

    //Sắp xếp theo thứ tự
    parentGroup: {
        type: Number
    }
})

module.exports = mongoose.model('Groups', GroupSchema)