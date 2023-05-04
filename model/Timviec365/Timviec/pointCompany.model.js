import mongoose from "mongoose";
const pointCompanySchema = new mongoose.Schema(
    {
        _id:{
            type: Number,
            required: true,
        },
        point:{
            type: Number,
            required: true,
        },
        pointUSC:{
            type: Number,
            required: true,
        },
        pointBaoLuu:{
            type: Number,
            required: true,
        },
        chuThichBaoLuu:String,
        dayResetPoint:Date,
        dayResetPoint0:Date,
    })
