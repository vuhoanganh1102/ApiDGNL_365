const ManageTracking = require("../../models/Users")
const functions = require("../../services/functions")

//tìm list cấu hình chấm công cty sử dụng 
exports.getlistTracking = async (req,res) =>{
    //lấy và gán giá trị  
    const  type_timekeeping = req.params.type_timekeeping

    if (!type_timekeeping) {
        functions.setError(res, "type_keeping not found ");
    } else {
        const list = await functions.getDatafind(ManageTracking, { type_timekeeping: type_timekeeping });
        if (!list) {
            functions.setError(res, "list of manage tracking cannot be found or does not exist");
        } else {
            funtions.success(res, "Get list of manage tracking successfully", list);
        }
    }
};

