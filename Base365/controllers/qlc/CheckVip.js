const functions = require("../../services/functions")
const user = require("../../models/Users")



exports.check = async (req,res) =>{
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