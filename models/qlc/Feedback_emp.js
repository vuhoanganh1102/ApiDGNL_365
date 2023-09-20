
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Feedback = new Schema({
    id: {//ID danh sách feedback
        type: Number,
    },
    cus_id: {
        type: Number
    },
    cus_name: {
        type: String
    },
    email: {// email
        type: String
    },
    phone_number: {// kieu user
        type: Number
    },
    feed_back: {//chi tiet
        type: String
    },
    rating: {// so sao
        type: Number,
    },
    create_date: {//thời điểm tao
        type: String,
    },
    app_name: {//
        type: String,
        default : "Chamcong365"
    },

    from_source: { //nguon  'From 1 là từ app, 2 là từ web'
        type: Number,
        default : 1
    },
}, {
    collection: 'QLC_Feedback_cus_for_emp',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model('QLC_Feedback_cus_for_emp', Feedback);