const mongoose = require('mongoose')


const access_ip = new mongoose.Schema({

    id_acc:{// id cài đặt ip
        type: Number,
        default : true
    },
    com_id :{// id công ty
        type: Number,
    },
    ip_access :{//địa chỉ ip
        type :String,

    },
    from_site : {// site cài IP 
        type: String,
    },
    created_time: {//thời điểm tạo
        type: Number,
    },
    update_time : {//o là chưa up date lần nào
        tpye: Date,
    }    
});
module.exports = mongoose.model('QLC_Access_ip', access_ip)