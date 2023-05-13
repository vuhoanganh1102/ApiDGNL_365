const mongoose = require('mongoose');
const CVUVSchema = new mongoose.Schema(
    {
        _id:{
            type: Number, 
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
            type: Object
        },
        nameImage:{
            type: String
        },
        userAvatar:{
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

module.exports = mongoose.model("CVUV", CVUVSchema);