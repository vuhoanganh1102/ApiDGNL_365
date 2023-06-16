const functions = require("../../services/functions")
// const appDelete = require("../../models/qlc/DelAppData")
const Tracking = require("../../models/qlc/HisTracking")



exports.deleteAllTRacking = async (req,res) =>{
        
        const request = req.body;
        let companyID = request.companyID,
            CreateAt = request.CreateAt || true
            TimeInputNewest = request.TimeInputNewest || null
            TimeInputOldest = request.TimeInputOldest || null
            Note = request.Note || null
    console.log(companyID)
    if (!companyID) {
        functions.setError(res, "Company id required");
    } else if (typeof companyID == "number") {
        functions.setError(res, "Company id must be a number");
    } else {
        const HisOfTracking = await functions.getDatafind(Tracking, { companyID: companyID ,CreateAt: { $gte: TimeInputOldest , $lte: TimeInputNewest }  });
        console.log(HisOfTracking)
        if (!HisOfTracking) {
            await functions.setError(res, "No HisOfTracking found in this company");
        } else {
            await Tracking.deleteMany({ companyID: companyID })
                .then(() => functions.success(res, "HisOfTracking deleted successfully", HisOfTracking))
                .catch((err) => functions.setError(res, err.message))
        }
    }
}