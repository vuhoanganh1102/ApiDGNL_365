import mongoose from "mongoose";
const adminUserRightSchema = new mongoose.Schema(
    {
        _id:{
            type: Number,
            required: true,
        },
        adminID:{
            type:Number,
            required: true,
        },
        adminModule:{
            type:Number,
            required: true,
        },
        add:{
            type:Number,
            default:0,
        },
        edit:{
            type:Number,
            default:0,
        },
        delete:{
            type:Number,
            default:0,
        }
    })
