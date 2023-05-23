import mongoose from 'mongoose';
const ResumeIndustrySchema = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    name: {
        type: Number
    },
    alias: {
        type: String
    },
    metaH1: {
        type: String
    },
    content: {
        type: String
    },
    cId: {
        type: Number
    },
    metaTitle: {
        type: String
    },
    metaKey: {
        type: String
    },
    metaDes: {
        type: String
    },
    status: {
        type: Number
    }
}, {
    collection: 'ResumeIndustry',
    versionKey: false
});

export default mongoose.model("ResumeIndustry", ResumeIndustrySchema)