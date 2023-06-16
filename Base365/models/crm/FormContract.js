//Model này dùng để 
const mongoose = require('mongoose')


const FormContract = new mongoose.Schema({
    _id: {
        //id 
        type: Number,
        required: true
    },
    name: {
        //
        type: String,
        required: true
    },
    path_file: {
        //
        type: String,
        // required: true
    },
    com_id: {
        //
        type: Number,
        required: true
    },
    ep_id: {
        //
        type: Number,
    },
    id_file: {
        //
        type: String,
        required: true
    },
    is_delete: {
        //
        type: Number,
    },
    created_at: {
        //
        type: Date,
        required: true
    },
    updated_at: {
        //
        type: Date,
        required: true
    },
   
});

module.exports = mongoose.model('FormContract', FormContract);