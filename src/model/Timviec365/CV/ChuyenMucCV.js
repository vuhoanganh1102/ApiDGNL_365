import mongoose from "mongoose";
const ChuyenMucCVSchema = new mongoose.Schema({
    _id:{
        type: Number,
        require: true
    },
    name:{
        type : String,
    },
    alias:{
        type: String
    },
    content:{
        type: String
    },
    image:{
        type: String
    },
    parent:{
        type: Number
    },
    menu:{
        type: Number
    },
    sort:{
        type: Number
    },
    metaTitle:{
        type: String
    },
    metaKey:{
        type: String
    },
    metaDes:{
        type: String
    },

},
    {collection: 'ChuyenMucCV',
    versionKey: false});

export default mongoose.model("ChuyenMucCV",ChuyenMucCVSchema)