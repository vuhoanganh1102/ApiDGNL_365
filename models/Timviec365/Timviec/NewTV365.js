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
            ref:'Category'
        },
        tagID:Number,
        cityID:{
            type:Number,
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
        sex:Number,
        bangCap:Number,
        position:String,
        soLuong:Number,
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
            type:{
                priNewId:{
                    type:Number,
                    required: true,
                },
                newId:{
                    type:Number,
                    required: true,
                },
                moTa:String,
                yeuCau:String,
                quyenLoi:String,
                hoSo:{
                    type:String,
                    required: true,
                },
                titleSeo:{
                    type:String,
                    required: true,
                },
                desSeo:{
                    type:String,
                    required: true,
                },
                hoaHong:{
                    type:String,
                    required: true,
                },
                tgtv:{
                    type:String,
                    required: true,
                },
                lv:{
                    type:String,
                    required: true,
                },
                baoLuu:String,
                timeBaoLuu:{
                    type:Date,
                    required: true,
                },
                jobPosting:{
                    type:Number,
                    required: true,
                },
                videoType:{
                    type:Number,
                    required: true,
                },
                videoActive:{
                    type:String,
                    required: true,
                },
                images:{
                    type:String,
                    required: true,
                }
            },
            default:null
        },
        newMoney:{
            type:{
                id: {
                    type: Number,
                    required: true,
                },
                newId: {
                    type: Number,
                    required: true,
                },
                type: {
                    type: Number,
                    required: true,
                },
                minValue: Number,
                maxValue: Number,
                unit: {
                    type: Number,
                    required: true,
                }
            },
            default:null
        }
    },
    { collection: 'NewTV365',  
    versionKey: false , 
    timestamp:true
  }  )
  module.exports = mongoose.model("NewTV365", newTV365Schema);
