const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StageProcessTrainingSchema = new Schema({
    // id tiến trình training
    _id: {
        type: Number,
        require: true
    },
    // tên tiến trình
    name: {
        type: String,
        default: null
    },
    // doi tuong cua giao doan
    objectTraining: {
        type: String,
        default: null
    },
    // noi dung
    content: {
        type: String,
        require: true,
    },
    // id cua quy trinh dao tao
    trainingProcessId: {
        type: Number,
        default: 0
    },
    isDelete: {
        type: Number,
        default: 0
    },
    // thời gian tạo
    createdAt: {
        type: Date,
        default: Date.now()
    },
    // thời gian update
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.Schema("HR_StageProcessTraining",StageProcessTrainingSchema);
