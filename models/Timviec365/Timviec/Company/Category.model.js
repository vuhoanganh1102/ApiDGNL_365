import mongoose from "mongoose";
const categorySchema = new mongoose.Schema(
    {
        _id:{
            type: Number,
            required: true,
        },
        name: String,
        title: String,
        tags: String,
        description: String,
        moTa: {
            type: String,
            required: true
        },
        parentID: String,
        lq: {
            type: String,
            required: true
        },
        count: {
            type: Number,
            default: 0
        },
        countVl: {
            type: Number,
            default: 0
        },
        order: {
            type: Number,
            default: 0
        },
        active: {
            type: Number,
            default: 1
        },
        hot: {
            type: Number,
            default: 0
        },
        ut: {
            type: Number,
            required: true
        },
        only: {
            type: Number,
            required: true,
            default: 0
        },
        except: {
            type: String,
            required: true
        },
        tlq: {
            type: String,
            required: true
        },
        tlqUV: {
            type: String,
            required: true
        },
        nameNew: {
            type: String,
            required: true
        }
    })
