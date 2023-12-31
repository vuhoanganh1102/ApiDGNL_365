import mongoose from "mongoose";
const formBlogSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    redirect301: {
        type: String,
        required: true,
    },
    cateID: {
        type: Number,
        required: true,
    },
    tagID: {
        type: Number,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    teaser: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    sapo: {
        type: String,
        required: true,
    },
    ghim: {
        type: Number,
        required: true,
    },
    view: {
        type: Number,
        required: true,
        default: 0
    },
    time: Date,
    timeEdit: Date,
    file: {
        type: Number,
        required: true,
    },
    dg: {
        type: Number,
        required: true,
    },
    cateUrl: {
        type: String,
        required: true,
    },
    ponitDg: {
        type: Number,
        required: true,
    },
    adminEdit: {
        type: Number,
        required: true,
    },
    audio: {
        type: Number,
        required: true,
    },
})