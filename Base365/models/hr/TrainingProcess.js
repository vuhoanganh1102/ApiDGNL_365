const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TrainingProcessSchema = new Schema({
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
    // mô tả
    description: {
        type: String,
        default: null
    },
    // id công ty
    com_id: {
        type: Number,
        require: true
    },
    // trạng thái xoá
    is_delete: {
        type: Number,
        require: true,
        default: 0
    },
    // thời gian tạo
    created_at: {
        type: String,
        default: null
    },
    // thời gian update
    updated_at: {
        type: String,
        default: null
    },
    // thời gian xoá
    deleted_at: {
        type: String,
        require: true
    },
    stage_training_process: {
        type: [{
            id_stage_training_process: {
                type: Number,
                require: true
            },
            name: {
                type: String,
                default: null
            },
            description: {
                type: String,
                default: null
            },
            is_delete: {
                type: Number,
                default: null
            },
            created_at: {
                type: String,
                default: null
            },
            updated_at: {
                type: String,
                default: null
            },
            deleted_at: {
                type: String,
                require: true
            }
        }]
    }
})