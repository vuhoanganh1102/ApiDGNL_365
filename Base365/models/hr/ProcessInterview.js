const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProcessInterviewSchema = new Schema({
    // id
    _id: {
        type: Number,
        require: true
    },
    // ten giai doan phong van
    name: {
        type: String,
        require: true
    },
    // giai doan truoc
    processBefore: {
        type: Number,
        default: 0
    },
    // id cong ty
    comId: {
        type: Number,
        require: true,
    },
    // thoi gian tao
    createdAt: {
        type: Date,
        default: Date.now(),
    },
},{
    collection: 'HR_ProcessInterviews',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_ProcessInterviews",ProcessInterviewSchema);
