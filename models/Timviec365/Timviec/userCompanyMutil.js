const mongoose = require('mongoose');
const Schema = mongoose.Schema
const userCompanyMultit = new mongoose.Schema(
    {
        _id:{
            type: Number,
        },
        uscID:{
            type:Number,
            require:true
        },
        // des của cty
        companyInfo:{
            type: String,
        },
        map: {
            type: String,
        },
        //dánh giá trên trong đóng góp
        dgc:Object,
        // đánh giá dưới trong đóng góp
        dgtv:Object,
        // time đánh giá
        dgTime:Date,
        skype:String,
        videoCom:String,
        lv:String
    })
    module.exports = mongoose.model("UserCompanyMultit", userCompanyMultit);
