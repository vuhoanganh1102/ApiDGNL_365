const mongoose = require('mongoose');
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
        redirect301:{
            type:String,
            default:""
        },
        cateID:{
            type:Number,
            ref:''
        },
        tagID:Number,
        cityID:{
            type:Number,
        },
        districtID:{
            type:String,
        },
        address:String,
        money:Number,
        capBac:Number,
        exp:Number,
        sex:Number,
        bangCap:Number,
        soLuong:Number,
        hinhThuc:Number,
        doTuoi:Number,
        createTime:Date,
        updateTime:Date,
        vipTime:Date,
        vip:Number,
        cateTime:Date,
        active:Number,
        type:Number,
        over:Number,
        viewCount:Number,
        hanNop:Date,
        post:Number,
        renew:{
            type:Number,
            default:0
        },
        hot:{
            type:Number,
            default:0
        },
        do:{
            type:Number,
            default:0
        },
        cao:{
            type:Number,
            default:0
        },
        nganh:{
            type:Number,
            default:0
        },
        ghim:{
            type:Number,
            default:0
        },
        thuc:{
            type:Number,
            default:0
        },
        order:{
            type:Number,
            default:0
        },
        order:{
            type:Number,
            default:0
        },
        ut:{
            type:Number,
            default:0
        },
        hideAdmin:{
            type:Number,
            default:0
        },
        sendVip:{
            type:Number,
            default:0
        },
        newMutil:{
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
                    type:String,
                },
                videoActive:{
                    type:String,
                },
                images:
                [
                    {
                    type:String,
                }]

        },
        newMoney:{
                type: {
                    type: Number,
                },
                minValue: Number,
                maxValue: Number,
                unit: {
                    type: Number,
                }
            },
        
    },
    { collection: 'NewTV365',  
    versionKey: false , 
    timestamp:true
  }  )
  module.exports = mongoose.model("NewTV365", newTV365Schema);
