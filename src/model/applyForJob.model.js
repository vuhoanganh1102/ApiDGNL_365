import mongoose from "mongoose";
const applyForJobSchema = new mongoose.Schema(
    {
        _id:{
            type: Number,
            required: true,
        },
        userID: {
            type:Number,
            required: true,
            ref: "User"
        },
        newID: {
            type:Number,
            required: true,
            ref:'NewTV365'
        },
        time: {
            type:Date,
            required: true
        },
        active:{
            type:Number,
            required: true
        },
        kq:{
            type:Number,
            required: true
        },
        timePV:{
            type:Date,
            required: true
        },
        timeTVS:{
            type:Date,
            required: true
        },
        timeTVE:{
            type:Date,
            required: true
        },
        text:{
            type:String,
            required: true
        },
        cv:{
            type:String,
            required: true
        }
    })
