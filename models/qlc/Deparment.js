const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const DeparmentSchema = new Schema({
    //ID phòng ban
    _id: {
        type: Number,
        required: true
    },

    //ID công ty của phòng ban
    companyId: {
        type: Number,
    },

    //Tên của phòng ban
    deparmentName: {
        type: String,
    },

    //Ngày lập phòng ban
    deparmentCreated: {
        type: Date,
        default: Date.now()
    },

    //ID quản lí phòng ban
    managerId: {
        type: Number
    },

    //Săp xếp theo thứ tự
    deparmentOrder: {
        type: Number
    }
})

module.exports = mongoose.model('Deparments', DeparmentSchema)