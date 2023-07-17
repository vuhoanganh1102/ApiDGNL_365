const functions = require("../../services/functions")
// const appDelete = require("../../models/qlc/DelAppData")
const Tracking = require("../../models/qlc/HisTracking")



exports.deleteAllTRacking = async (req, res) => {
    try {
        const request = req.body;
        let com_id = req.user.data.com_id,
            TimeInputOldest = request.TimeInputOldest 
            TimeInputNewest = request.TimeInputNewest 
        let at_time = ""
        let conditions = {}
        if(TimeInputOldest&&TimeInputNewest) conditions["at_time"] = { $gte: TimeInputOldest, $lte: TimeInputNewest } 
        if(com_id) conditions.com_id = com_id
        if (com_id) {
            const HisOfTracking = await functions.getDatafind(Tracking,conditions );
            if (HisOfTracking) {
                await Tracking.deleteMany(conditions)
                return functions.success(res, "HisOfTracking deleted successfully", {HisOfTracking})
            }
            return functions.setError(res, "No HisOfTracking found in this company");
        }
        return functions.setError(res, "Company id required");
    } catch (error) {
        return functions.setError(res, err.message)

    }
}