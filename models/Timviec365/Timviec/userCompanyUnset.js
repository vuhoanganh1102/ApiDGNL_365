const mongoose = require('mongoose');
const Schema = mongoose.Schema
const userCompanyUnset = new mongoose.Schema(
    {
        _id:{
            type: Number,
        },
        email:{
            type: String,
        },
        phone: {
            type: String,
        },
        nameCompany: {
            type: String,
        },
        city:Number,
        district:Number,
        address:String,
        errTime:Date,
        regis:Number
    })
    module.exports = mongoose.model("UserCompanyUnset", userCompanyUnset);
