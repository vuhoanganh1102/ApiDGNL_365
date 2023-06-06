const mongoose = require('mongoose')

const setting = new mongoose.Schema({
id : {
    type : Number
},
id_user : {
    type : Number
},
type_tb : {
    type : String
},

type_nhac_nho : {
    type : String

},
time_duyet_setting : {
    type : Date
}
});

module.exports = mongoose.Model("Van_thu_setting",setting);