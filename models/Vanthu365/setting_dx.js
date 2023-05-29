const mongoose = require('mongoose');
const settingDx = new mongoose.Schema({
    idSetting: { type: Number },
    ComId: { type: Number },
    typeSetting: { type: Number },
    typeBrowse: { type: Number },
    timeLimit: { type: Number },
    shiftId: { type: Number },
    timeLimitL: { type: String },
    listUser: { type: String },
    timeTP: { type: Number },
    timeHH: { type: Number },
    timeCreate: { type: Number },
    updateTime: { type: Number },

})

module.exports = mongoose.model("SettingDx", settingDx);