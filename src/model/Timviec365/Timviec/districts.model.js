import mongoose from "mongoose";
const districtSchema = new mongoose.Schema(
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
        parent:{
            type:Number,
            required:true
        }
    })
