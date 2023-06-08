const functions = require("../../services/functions");
const users = require("../../models/Users")
const calEmp = require("../../models/qlc/CalendarWorkEmployee")

exports.getlistUserNoneSetCarlendar = async (req,res) =>{
    const data = await users.find({companyID: companyID , type  : 2 }).select('_id idQLC depID companyID email phoneTK avatarUser')
    const data2 = await calEmp.find({companyID: companyID  }).select(' idQLC companyID  ')
    data = data.filter(idQLC => !data2.includes(idQLC));
    console.log(data)

}
exports.getListHisOfUserTracking = async (req,res)=>{
    
}