const mongoose = require('mongoose');
const evaluationSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },

    uscID: {
        // id company
        type: Number,
        required: true
    },

    dgc: {
        //đánh giá chuyên viên
        type: String,
        default: null
    },

    dgtv: {
        // đánh giá web
        type: String,
        default: null
    },

    dgTime: {
        // thời gian đánh giá
        type: Date,
        default: null
    }
}, {
    collection: 'Evaluation',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Evaluation", evaluationSchema);