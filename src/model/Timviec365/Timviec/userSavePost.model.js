import mongoose from "mongoose";
const userSavePostSchema = new mongoose.Schema(
    {
        _id:{
            type: Number,
            required: true,
        },
        userID: {
            type: Number,
            required: true
        },
        newID: {
            type: Number,
            default: 0
        },
        saveTime: {
            type: Date,
            required: true
        }
    })
