const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userUnsetSchema = new mongoose.Schema(
    {
       id:{
        type: Number
       },
       useMail:{
        type: String
       },
       usePhoneTk:{
        type: String
       },
       usePass:{
        type: String
       },
       usePhone:{
        type: String
       },
       useCity:{
        type: Number
       },
       useQh:{
        type: Number
       },
       useAddr:{
        type: String
       },
       useCvTitle: {
        type: String
       },
       useCvCity:{
        type: String
       },
       useCvCate:{
        type: String
       },
       useCreateTime:{
        type: Number
       },
       useLink:{
        type: String
       },
       useActive:{
        type: Number
       },
       useDelete:{
        type: Number
       },
       type:{
        type: Number
       },
       empId:{
        type: Number
       },
       error:{
        type: Number
       },
       uRegis:{
        type: Number
       }

       
    },
    { collection: 'userUnset',  
    versionKey: false , 
    timestamp:true
  }  
    )
module.exports = mongoose.model("userUnset", userUnsetSchema);