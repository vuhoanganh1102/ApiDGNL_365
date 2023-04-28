import mongoose from "mongoose";
const citySchema = new mongoose.Schema(
    {
        _id:{
            type: Number,
            required: true,
        },
        name:String,
        order:{
            type: Number,
            default:0
        },
        type:Number,
        count:{
            type: Number,
            default:0
        },
        countVl:{
            type: Number,
            default:0
        },
        postCode:{
            type: String,
            required:true
        },
        tw:{
            type: Number,
            required:true
        },
        code:{
            type:String,
            required:true
        },
        cCode:{
            type:String,
            required:true
        },
        imgCity:{
            type:String,
            required:true
        },
        m:{
            type:Number,
            required:true
        }
    })
