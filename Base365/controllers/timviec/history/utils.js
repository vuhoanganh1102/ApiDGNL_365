const User = require("../../../models/Users");
const CreditExchangeHistory = require("../../../models/Timviec365/UserOnSite/Company/ManageCredits/CreditExchangeHistory")

exports.userExists = async (usc_id, type)=>{
    try {
        let user = await User.findOne({idTimViec365: usc_id, type});
        if (!user) return false;
        return true;
    }
    catch (error) {
       console.log(error);
       return false;
    }
}

function num(value) {
    if (!value) return 0;
    return Number(value);
}

const getTotalUsedPresPoint = async (usc_id) => {
    try {
        let exchangeHistory = await CreditExchangeHistory.find({userId: usc_id});
        if (!exchangeHistory||!exchangeHistory.length) return 0;
        return exchangeHistory.reduce((acc, val) => acc + num(val.point), 0);
    } catch (error) {
        console.log(error);
        return null;
    }
}

exports.saveHistory = async (history) => {
    try {
        let fields = [
            "point_time_active",
            "point_see",
            "point_use_point",
            "point_share_social_new",
            "point_share_social_url",
            "point_share_social_user",
            "point_vote",
            "point_next_page",
            "point_see_em_apply",
            "point_vip",
            "point_TiaSet",
            "point_comment",
            "point_ntd_comment",
            "point_be_seen_by_em",
            "point_content_new"
        ]
        let pointToChange = 0;
        fields.forEach(field => {
            pointToChange += history[field]?history[field]:0;
        })
        history.point_to_change = pointToChange;
        let usedPoints = await getTotalUsedPresPoint(history.userId);
        //Trường sum là tổng cả điểm đã dùng và chưa dùng
        history.sum = history.point_to_change + usedPoints;
        return await history.save()
    } catch (error) {
        console.log(error);
        return false;
    }
}