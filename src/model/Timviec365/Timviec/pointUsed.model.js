import mongoose from "mongoose";
const pointUsedSchema = new mongoose.Schema(
    {
        _id:{
            type: Number,
            required: true,
        },
        uscID:{
            type: Number,
            required: true,
        },
        useID:{
            type: Number,
            required: true,
        },
        point:{
            type: Number,
            required: true,
        },
        type:{
            type: Number,
            required: true,
        },
        typeErr:{
            type: Number,
            required: true,
        },
        noteUV:{
            type: String,
            required: true,
        },
        usedDay:{
            type: Number,
            required: true,
        },
        returnPoint:{
            type: Date,
            required: true,
            default:0
        },
        adminID:{
            type: Number,
            required: true,
        },
        ipUser:{
            type: String,
            required: true,
        },
    })
