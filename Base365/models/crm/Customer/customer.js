const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crm_customer = new Schema({
    cus_id : {
        type : Number
    },
    email : {
        type : String
    },
    phone_number : {
        type : String
    },
    name : {
        type : String
    },
    stand_name : {
        type : String,
        default : null
    },
    logo : {
        type : String,
        default : null
    },
    birthday : {
        type : Date,
        default : null
    },
    tax_code : {
        type : String,
        default : null
    },
    cit_id : {
        type : Number
    },
    district_id : {
        type : Number
    },
    ward : {
        type : Number
    },
    address : {
        type : String
    },
    ship_invoice_address : {
        type : String,
        default : null
    },
    gender : {
        type : String,
        default : null
    },
    cmnd_ccnd_number : {
        type : Number,
        default : null
    },
    cmnd_ccnd_address : {
        type : String,
        default : ""
    },
    cmnd_ccnd_time : {
        type : Date,
        default : "0"
    },
    resoure : {
        type : Number
    },
    description : {
        type : String,
        default : ""
    },
    introducer : {
        type : String,
        default : null
    },
    contact_name : {
        type : String,
        default : null
    },
    contact_email : {
        type : String,
        default : null
    },
    contact_phone : {
        type : String,
        default : null
    },
    contact_gender : {
        type : Number,
        default :"0"
    },
    company_id : {
        type : Number
    },
    emp_id : {
        type : Number
    },
    user_handing_over_work :{
        type : Number
    },
    user_create_type : {
        type : String
    },
    user_edit_id : {
        type : Number
    },
    user_edit_type :{
        type : String
    },
    group_id : {
        type : Number
    },
    status : {
        type : Number
    },
    business_areas : {
        type : Number,
        default :0
    },
    category : {
        type : Number
    },
    business_type : {
        type : Number,
        default :0
    },
    classify : {
        type : Number,
        default :0
    },
    bill_city : {
        type : Number,
        default :0
    },
    bil_district : {
        type : Number,
        default : 0
    },
    bill_ward : {
        type : Number,
        default :0
    },
    bill_address : {
        type : String,
        default : null
    },
    bill_area_code : {
        type : String,
        default : null
    },
    bill_invoice_address : {
        type : String,
        default : null
    },
    bill_invoice_address_email : {
        type : String,
        default : null
    },
    ship_city : {
        type : String,
        default : "0"
    },
    ship_area : {
        type : String,
        default : null
    },
    bank_id : {
        type : Number,
        default : 0
    },
    bank_account : {
        type : String,
        default : ""
    },
    revenue : {
        type : Number,
        default : 0
    },
    size : {
        type : Number,
        default : 0
    },
    rank : {
        type : Number,
        default : 0
    },
    website : {
        type : String,
        default : null
    },
    number_of_day_owed : {
        type : Number,
        default : 0
    },
    deb_limit : {
        type : Number,
        default :0
    },
    share_all : {
        type : Number,
        default :0
    },
    type : {
        type : Number,
    },
    is_input : {
        type : Number,
        default :0
    },
    is_delete : {
        type : Number
    },
    created_at : {
        type : Date
    },
    updated_at : {
        type : Date
    },
    id_cus_from : {
        type : String,
    },
    cus_from : {
        type : String
    },
    link : {
        type : String,
        default :null
    }

},{
        collection: 'CRM_customer',
        versionKey: false,
        timestamp: true
    })
    module.exports = mongoose.model("crm_customer", crm_customer);