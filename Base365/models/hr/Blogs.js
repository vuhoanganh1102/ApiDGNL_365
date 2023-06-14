const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HR_BlogSchema = new Schema({
    // Id 
    _id: {
        type: Number,
        require: true
    },
    // nội dung
    content: {
        type: String,
        require: true
    },
    // bình luận
    comment: {
        type: String,
        require: true
    },
   
}, {
    collection: 'HR_Blogs',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_Blogs", HR_BlogSchema);