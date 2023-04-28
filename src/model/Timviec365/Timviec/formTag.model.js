import mongoose from "mongoose";
const formTagSchema = new mongoose.Schema(
    {
        _id:{
            type: Number,
            required: true,
        },
        name: {
            type:String,
            required:true
        },
        redirect301: {
            type:String,
            required:true
        },
        title: {
            type:String,
            required:true
        },
        description: {
            type:String,
            required:true
        },
        key: {
            type:String,
            required:true
        },
        active: {
            type:Number,
            required:true
        }
    })
