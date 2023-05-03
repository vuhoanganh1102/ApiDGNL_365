import mongoose from 'mongoose';
const CVUVSchema = new mongoose.Schema(
    {
        _id:{
            type: Number
        },
        userId:{
            type: Number
        },
        cvId:{
            type: Number
        },
        lang:{
            type: String
        },
        html:{
            color:String,
            font:String,
            fontSize:String,
            fontSpacing:String,
        },
        nameImage:{
            type: String
        },
        timeEdit:{
            type: Date
        },
        cv:{
            type: Number
        },
        status:{
            type: Number
        },
        deleteCv:{
            type: Number
        },
        heightCv:{
            type: Number
        },
        scan:{
            type: Number
        },
        state:{
            type: Number
        }
    },
    { collection: 'CVUV',
      versionKey: false}
);

export default mongoose.model("CVUV", CVUVSchema)