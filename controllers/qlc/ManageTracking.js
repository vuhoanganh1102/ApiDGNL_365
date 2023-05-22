const ManageTracking = require("../../model/qlc/ManageTracking")
const functions = require("../../services/functions")

//tìm list chấm công cty sử dụng 
exports.getlistTracking = async (req,res) =>{
    const { companyId } = req.body

    if(!companyId){
        functions.setError(res,"id company required")
    } else if (typeof companyId !=='number'){
        functions.setError(res, "company id must be a number")
    }else {
        const Tracking = await functions.getDatafind(ManageTracking, { companyId: companyId})
        if (!Tracking){
            functions.setError(res, "Tracking cant be found or doesnt exist ")
        } else {
            functions.success(res, " Tracking found ", Tracking)

            }
        }
    }
exports.editTracking = async(req,res) =>{
    const QRtracking = await functions.getDatafindOne(ManageTracking, {name:"QRTracking",checkedValue : true })
    // if(!QRtracking &&  )
}