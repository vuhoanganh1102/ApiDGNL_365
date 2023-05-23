import mongoose from 'mongoose';
const CategoryCVSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    catName: {
        //tên cat cv
        type: String,
    },
    catTags: {
        //thẻ cate cv
        type: String,
    },
    catDescription: {
        //chú thích cat cv
        type: String
    },
    catMota: {
        //mô tả cat cv
        type: String
    },
    catParentId: {
        //Id của cat cha(cat to)
        type: Number
    },
    catCount: {
        type: Number
    },
    catOrder: {
        type: Number
    },
    catActive: {
        // cat cv này có kích hoạt hay không
        type: Number
    },
    catHot: {
        // cat này có hot hay không
        type: Number
    }
}, {
    collection: 'CategoryCV',
    versionKey: false
});

export default mongoose.model("CategoryCV", CategoryCVSchema)