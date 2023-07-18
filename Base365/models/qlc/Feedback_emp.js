const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedback_emp = new Schema({
    _id: {//ID danh sách feedback_emp
        type: Number,
    },
    idQLC: {
        type: Number
    },
    cus_id: {
        type: Number
    },
    email: {// email khách hàng
        type: String
    },
    phone_number: {//sdt khách hàng
        type: Number
    },
    feed_back: {//chi tiet
        type: String
    },
    rating: {// so sao
        type: Number,
    },
    name: {// tên khách hàng
        type: String,
    },
    createdAt: {//thời điểm tao
        type: Number,
    },
    app_name: {//
        type: String,
    },

    from_source: { //nguon
        type: Number,
    },
}, {
    collection: 'QLC_Feedback_emp',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model('QLC_Feedback_emp', feedback_emp);