const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportError = new Schema({
    id_report: {//ID danh sách bao loi
        type: Number,
    },
    user_id: {
        type: Number
    },
    device_id: {//ID thiet bi
        type: String
    },
    type_user: {// kieu user
        type: Number
    },
    detail_error: {//chi tiet loi
        type: String
    },
    gallery_image_error: {//anh
        type: String,
    },

    time_create: {//thời điểm tao
        type: Date,
        default : new Date()
    },
    from_source: { //nguon
        type: Number,
        default : 'quanlichung'
    },
})

module.exports = mongoose.model('QLC_ReportError', ReportError);