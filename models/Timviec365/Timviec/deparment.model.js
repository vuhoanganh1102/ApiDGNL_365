import mongoose from "mongoose";
const deparmentSchema = new mongoose.Schema(
    {
        _id:{
            type: Number,
            required: true,
        },
        com_id:Number,
        dep_name:String,
        dep_created_time:Date,
        manager_id:Number,
        dep_order:Number
    })
