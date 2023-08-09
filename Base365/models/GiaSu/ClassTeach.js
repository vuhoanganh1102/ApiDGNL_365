const mongoose = require("mongoose");
const class_teach = new mongoose.Schema({

    ct_id: {
        type : Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    ct_name: {
        type : String,

    },
    ls_parent: {
        type : Number,

    },

}, {
    collection: "GS_class_teach",
    versionKey: false,
}
);
module.exports = mongoose.model("GS_class_teach", class_teach);