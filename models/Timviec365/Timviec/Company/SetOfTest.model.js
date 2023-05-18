import mongoose from "mongoose";
const deparmentSchema = new mongoose.Schema(
    {
        _id:{
            type: Number,
            required: true,
        },
        cate: {
            type:String,
            required:true,
        },
        order:{
            type:Number,
            required:true,
        },
        footerOrder:{
            type:Number,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        keyword:{
            type:String,
            required:true,
        },
        title:{
            type:String,
            required:true,
        },
        mota:{
            type:String,
            required:true,
        }
    })
