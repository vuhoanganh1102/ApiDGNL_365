const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SignatureImageSchema = new Schema({
    // id kỹ kí hình ảnh
    _id:{
        type:Number,
        require:true
    },
    // id nhân viên 
    ep_id:{
        type:Number,
        require:true
    },
    // tên hình ảnh
    image_name:{
        type:String,
        require:true
    },
    // thời gian tạo
    created_at:{
        type:String,
        require:true
    },
    // tình trạng xoá
    is_delete:{
        type:Number,
        require:true,
        default:0
    },
    // thời gian xoá
    deleted_at:{
        type:String,
        require:true
    }
});

module.exports = mongoose.Schema("HR_SignatureImage",SignatureImageSchema);