const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SalarySchema = new Schema({
    // id tu dong tang
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    // loai
    idUser: {
        type: Number,

    },
    // loai nhac nho
    comId: {
        type: Number,

    },
    // id ung vien
    salaryBasic: {
        type: Number,

    },
    //ho ten cua ung vien
    salaryBh: {
        type: String,

    },
    // id cong ty
    pcBh: {
        type: Number,
 
    },
    // id nguoi dung
    timeUp: {
        type: Date,

    },
    // thời gian nhac nho
    location: {
        type: Number,
      
    },
    // thoi gian tao
    lydo: {
        type: String,
       
    },
    quyetdinh: {
        type: String,
        
    },
    first: {
        type: Number,
        
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
},{
    collection: 'HR_Salarys',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_Salarys",SalarySchema);
