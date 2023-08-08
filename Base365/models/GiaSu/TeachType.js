const mongoose = require("mongoose");
const teachtype = new mongoose.Schema({

    id : {
        type : Number,

    },
    nametype : {
        type : String,

    },

}, {
    collection: "GS_teachtype",
    versionKey: false,
}
);
module.exports = mongoose.model("GS_teachtype", teachtype);