import mongoose from 'mongoose';
const CategoryCVSchema = new mongoose.Schema(
    {
        _id:{
            type: Number,
            required: true
        },
        catName:{
            type: String,
        },
        catTags:{
            type: String,
        },
        catDescription:{
            type: String
        },
        catMota:{
            type: String
        },
        catParentId:{
            type: Number
        },
        catCount:{
            type:Number
        },
        catOrder:{
            type:Number
        },
        catActive:{
            type: Number
        },
        catHot:{
            type: Number
        }
    },
    { collection: 'CategoryCV',
      versionKey: false}
);

export default mongoose.model("CategoryCV", CategoryCVSchema)