const functions = require("../../../services/functions");
const {saveHistory, userExists} = require("./utils");
const ManagePointHistory = require("../../../models/Timviec365/UserOnSite/Company/ManageCredits/PresPointHistory");
const SaveSeeRequest = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveSeeRequest");

// api bài toán 2 
// hàm phụ trợ
const handleCalculateSeen = async (userId,type) =>{
    try{
        let point = 1/300;
        let POINT_LIMIT = 10;
        let history = await ManagePointHistory.findOne({userId: userId, type});
        if (history) {
            let oldPoints = history.point_see;
            history.point_see = oldPoints + point < POINT_LIMIT ? oldPoints + point : POINT_LIMIT;
        } else {
            point = point > POINT_LIMIT? POINT_LIMIT: point;
            history = new ManagePointHistory({
                point_to_change: point,
                point_see: point,
                sum: point
            });
        }
        await saveHistory(history);
        return true;
    }
    catch (error) {
        console.log('error handleCaculateSeen', error);
        return false;
    }
}
const insertSeenRequest = async (userId,type,userIdBeSeen,typeIdBeSeen) =>{
   try{
        let userSeen = await userExists(userId,type);
        let userBeSeen = await userExists(userIdBeSeen,typeIdBeSeen);
        if(userSeen && userBeSeen){
            let isDuplicated = await SaveSeeRequest.findOne({userId, type, userIdBeSeen, typeIdBeSeen});
            if (!isDuplicated) {
                let now = functions.getTimeNow();
                await (new SaveSeeRequest({
                    userId: userId,
                    type: type,
                    userIdBeSeen: userIdBeSeen,
                    typeIdBeSeen: typeIdBeSeen,
                    time: now,
                })).save()
                await handleCalculateSeen(userId,type)
            }
            return true;
        }
        else{
            return false;
        }
   }
   catch (error) {
        console.log('error InserSeenRequest', error);
        return false;
   }
}

// api 
const calcSeenPoints = async (req, res, next) => {
    try {
        let {
            userId,
            userIdBeSeen,
            type,
            typeIdBeSeen,
        } = req.body;
        if (!userId||!userIdBeSeen) return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        await insertSeenRequest(userId,type,userIdBeSeen,typeIdBeSeen);
        return functions.success(res, "Thành công");
    }
    catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra", 500);
    }
}
