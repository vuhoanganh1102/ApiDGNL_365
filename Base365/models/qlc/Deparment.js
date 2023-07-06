const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const DeparmentSchema = new Schema({
    //ID phòng ban
    _id: {
        type: Number,
        required: true
    },

    //ID công ty của phòng ban
    com_id: {
        type: Number,
    },

    deparmentName: {
        type: String,
    },

    //Ngày lập phòng ban
    deparmentCreated: {
        type: Date,
        default: Date.now()
    },

    //ID Trưởng phòng 
    managerId: {
        type: Number
    },
    //ID phó phòng 
    deputyId: {
        type: Number
    },

    //Săp xếp theo thứ tự
    deparmentOrder: {
        type: Number
    },
    // tổng số nhân viên 
    total_emp : {
        type :Number,
    }
})

module.exports = mongoose.model('QLC_Deparments', DeparmentSchema)