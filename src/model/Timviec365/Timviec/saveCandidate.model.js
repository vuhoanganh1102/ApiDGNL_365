import mongoose from "mongoose";
const saveCandidateSchema = new mongoose.Schema(
    {
        _id:{
            type: Number,
            required: true,
        },
        uscID: {
            type: Number,
            required: true
        },
        userID: {
            type: Number,
            default: 0
        },
        saveTime: {
            type: Date,
            required: true
        }
    })
