
//Model này dùng để 
const mongoose = require('mongoose')


const DetailFormContract = new mongoose.Schema({
    _id: {
        //id 
        type: Number,
        required: true
    },
    id_form_contract : {
        //
        type : Number,
    },
    new_field : {
        //
        type : String,
    },
    old_field : {
        //
        type : String,
    },
    index_field : {
        //
        type : String,
    },
    default_field : {
        //
        type : Number,
    },
});

module.exports = mongoose.model('DetailFormContract', DetailFormContract);

