//Model này dùng để 
const mongoose = require('mongoose')

//hợp đồng
const FormContract = new mongoose.Schema({
    _id: {
        //id hợp đồng 
        type: Number,
        required: true
    },
    name: {
        //tên hợp đồng 
        type: String,
        required: true
    },
    path_file: {
        //đường dẫn file
        type: String,
        // required: true
    },
    com_id: {
        //id công ty
        type: Number,
        required: true
    },
    ep_id: {
        //id nhân viên
        type: Number,
    },
    id_file: {
        //id file
        type: String,
        required: true
    },
    is_delete: {
        //xóa hay chưa 
        type: Number,
    },
    created_at: {
        //thời điểm tạo 
        type: Date,
        required: true
    },
    updated_at: {
        //thời điểm cập nhật 
        type: Date,
        required: true
    },
   
});

module.exports = mongoose.model('FormContract', FormContract);