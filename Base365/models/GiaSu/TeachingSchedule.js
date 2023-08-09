const mongoose = require("mongoose");
const teaching_schedule = new mongoose.Schema({
    // lịch có thể dạy của gia sư
    ts_id : {
        type : Number,
        required: true,
        unique: true,
        autoIncrement: true

    },
    ugs_id : {
        type : Number,

    },
    pft_id : {
        type : Number,

    },
    st2 : {
        type : Number,

    },
    st3 : {
        type : Number,

    },
    st4 : {
        type : Number,

    },
    st5 : {
        type : Number,

    },
    st6 : {
        type : Number,

    },
    st7 : {
        type : Number,

    },
    scn : {
        type : Number,

    },
    ct2 : {
        type : Number,

    },
    ct3 : {
        type : Number,

    },
    ct4 : {
        type : Number,

    },
    ct5 : {
        type : Number,

    },
    ct6 : {
        type : Number,

    },
    ct7 : {
        type : Number,

    },
    ccn : {
        type : Number,

    },
    tt2 : {
        type : Number,

    },
    tt3 : {
        type : Number,

    },
    tt4 : {
        type : Number,

    },
    tt5 : {
        type : Number,

    },
    tt6 : {
        type : Number,

    },
    tt7 : {
        type : Number,

    },
    tcn : {
        type : Number,

    },

}, {
    collection: "GS_teaching_schedule",
    versionKey: false,
}
);
module.exports = mongoose.model("GS_teaching_schedule", teaching_schedule);