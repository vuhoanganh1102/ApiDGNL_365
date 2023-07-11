const mongoose = require('mongoose')
const ChildCompany = new mongoose.Schema({
    //Id bảng
    _id : {
        type : Number,
        required : true 
    },
    //Id của công ty
    companyName: {
        type : String
    },
    //anh cty con
    companyImage: {
        type: String
    },
    //Id cty cha
    com_id: {
        type : Number
    },
    companyPhone:{
        type : Number
    },
    companyEmail:{
        type : String
    },
    companyAddress:{
        type : String
    },
    //Thời điểm tạo 
    createdAt: {
        type: Date,
        default: Date.now()
    },

}, {
    collection: 'QLC_ChildCompany',
    versionKey: false,
    timestamp: true
})



module.exports = mongoose.model('QLC_ChildCompany',ChildCompany)