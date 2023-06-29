const functions = require("../../services/functions")
const user = require("../../models/Users")



exports.check1 = async (req,res) =>{
    const idQLC = req.user.data.idQLC
    let data = [];
    data = await user.find({idQLC : idQLC }).select("inForCompany.com_vip")
    console.log(data)
    console.log(data[0].inForCompany["com_vip"])
    if(data[0].inForCompany["com_vip"] === 1) {
        functions.success(res,"Cong ty VIP")
    }else if ( data[0].inForCompany["com_vip"] === 0){
        functions.success(res,"Công ty thường ")
        
    }else if (data[0].inForCompany["com_vip"] === null){
        functions.setError(res,"Công ty không xác định ")
        
    }else {
        functions.setError(res," không tìm thấy thông tin công ty ")

    }
}

exports.check2 = async (req,res) =>{
    const com_id = req.body.com_id
    let data = [];
    let timeVip = [];
    let userVip = [];
    const timeStart = "2023-05-20 23:59:59"

    data = await user.findOne({com_id : com_id }).select("inForCompany.cds.com_vip inForCompany.cds.com_vip_time inForCompany.cds.com_ep_vip createdAt" )
    // if()
    console.log(data)
    console.log(data[0].inForCompany.cds["com_vip"])
    if(data[0].inForCompany.cds["com_vip"] === 1) {
        functions.success(res,"Cong ty VIP")
     if(timeVip){}





    }else if ( data[0].inForCompany["com_vip"] === 0){
        await user.findCount({com_id : com_id })



        functions.success(res,"Công ty thường ")
        
    }else if (data[0].inForCompany["com_vip"] === null){
        functions.setError(res,"Công ty không xác định ")
        
    }else {
        functions.setError(res," không tìm thấy thông tin công ty ")

    }
}