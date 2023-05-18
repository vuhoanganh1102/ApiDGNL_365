const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const childCompanySchema = new Schema({
    //ID công ty con
    _id: {
        type: Number,
        required: true
    },
    //Tên của Công ty con
    companyName: {
        type: String,
    },
    //logo công ty con 
    companyImage: {
        data: Buffer,
        contentType: String,
    },

    //ID công ty mẹ
    holdingCompanyId: {
        type: Number,
    },

    // số điện thoại Cty con
    companyPhone: {
        type: Number
    },

    // email cty con
    companyEmail: {
        type: String,
    },

    // địa chỉ công ty con 
    companyAddress: {
    type: String,
    },

    //Săp xếp theo thứ tự
    companyOrder: {
        type: Number
    }
})


module.exports = mongoose.model('childCompany', childCompanySchema)