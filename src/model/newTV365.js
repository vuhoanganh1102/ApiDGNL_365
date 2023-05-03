import mongoose from "mongoose";
import {model} from "mongoose";
const newTV365Schema = new mongoose.Schema(
    {
        _id:{
            type: Number,
            required: true,
        },
        userID:String,
        title:String,
        newMd5:String,
        alias:String,
        redirect301:String,
        cateID:{
            type:String,
            ref:'Category'
        },
        tagID:String,
        cityID:{
            type:String,
            ref:"City"
        },
        districtID:{
            type:String,
            ref:"District"
        },
        address:String,
        money:Number,
        capBac:Number,
        exp:Number,
        bangCap:Number,
        sex:String,
        salary:Number,
        hinhThuc:Number,
        doTuoi:Number,
        createTime:Date,
        updateTime:Date,
        vipTime:Date,
        vip:Date,
        cateTime:Date,
        active:Number,
        type:Number,
        over:Number,
        viewCount:Number,
        hanNop:Date,
        post:Number,
        renew:Number,
        newMulti:{
                newId:{
                    type:Number,
                    required: true,
                },
                moTa:String,
                yeuCau:String,
                quyenLoi:String,
                hoSo:{
                    type:String,
                },
                titleSeo:{
                    type:String,
                   
                },
                desSeo:{
                    type:String,
                    
                },
                hoaHong:{
                    type:String,
                   
                },
                tgtv:{
                    type:String,
                    
                },
                lv:{
                    type:String,
                    
                },
                baoLuu:String,
                timeBaoLuu:{
                    type:Date,
                    
                },
                jobPosting:{
                    type:Number,
                    
                },
                videoType:{
                    type:Number,
                    
                },
                videoActive:{
                    type:String,
                    
                },
                images:{
                    type:String,
            },
        },
        newMoney:{
                id: {
                    type: Number,
                },
                newId: {
                    type: Number,
                },
                type: {
                    type: Number,
                },
                minValue: Number,
                maxValue: Number,
                unit: {
                    type: Number,
                }
            }
    },
    { collection: 'NewTV365',  
    versionKey: false , 
    timestamp:true
  }  
    )
    export default model("NewTV365", newTV365Schema);