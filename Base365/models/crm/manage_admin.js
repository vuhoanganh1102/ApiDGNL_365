const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crm_manage_admin = new Schema({
   id : {
    type : Number,
    require : true
   },
   id_form : {
    type : Number,
   },
   name : {
    type : String
   },
   phone_number : {
    type : String,
    default : ""
   },
   email : {
    type : String,
    default : 0
   },
   gender : {
    type : Number,
    default :""
   },
   birthday : {
    type : Date,
    default : null
   },
   address : {
    type : String
   },
   question : {
    type : Number
   },
   answer : {
    type : Number
   },
   choose_answer: {
    type : String,
    default : null
   },
   type : {
    type : String
   },
   created_at : {
    type : Date
   },
   updated_at : {
    type : Date
   }
},{
    collection: 'CRM_manage_admin',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("crm_manage_admin", crm_manage_admin);