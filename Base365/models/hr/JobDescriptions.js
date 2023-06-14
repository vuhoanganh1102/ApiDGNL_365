const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const JobDescriptionsSchema = new Schema({
    // id mô tả công việc
    _id:{
        type:Number,
        require:true
    },
    // tên công việc
    name:{
        type:String,
        default:null
    },
    // tên bộ phận
    department_name:{
        type:String,
        default:null
    },
    // mô tả
    description:{
        type:String,
        default:null
    },
    // yêu cầu job
    job_require:{
        type:String,
        default:null
    },
    // bản đồ
    road_map:{
        type:String,
        require:true
    },
    // id công ty
    com_id:{
        type:Number,
        require:true
    },
    // thời gian tạo
    created_at:{
        type:String,
        default:null
    },
    // thời gian xoá
    deleted_at:{
        type:String,
        default:null
    },
    // trạng thái xoá
    is_delete:{
        type:Number,
        default:0
    }
});