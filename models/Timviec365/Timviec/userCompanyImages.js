const mongoose = require('mongoose');
const Schema = mongoose.Schema
// model lưu data của kho ảnh của ntd
const userCompanyImages = new mongoose.Schema(
    {
        _id:{
            type: Number,
        },
        idUser:{
            // id ntd
            type: String,
        },
        listImg: 
        [{
            // danh sách ảnh
            type: String,
        }],
        default : [],
        listVideo: 
        [ {
            // danh sách video
            type: String,
        }], 
        default : [],
        // kích hoạt
        active:Number,
        // thời gian tạo
        timeCreate:Date,
        // thời gian sửa
        timeUpdate:Date,
    }
    ,
    { collection: 'UserCompanyImages',  
    versionKey: false , 
    timestamp:true
  }  )
    module.exports = mongoose.model("UserCompanyImages", userCompanyImages);
