const functions = require('../../services/functions');
const Credits = require('../../models/Timviec365/UserOnSite/Company/ManageCredits/Credits');
const CreditsHistory = require('../../models/Timviec365/UserOnSite/Company/ManageCredits/CreditsHistory');
const CreditExchangeHistory = require('../../models/Timviec365/UserOnSite/Company/ManageCredits/CreditExchangeHistory');
const PresPointHistory = require('../../models/Timviec365/UserOnSite/Company/ManageCredits/PresPointHistory');
const PTCMultiplier = require('../../models/Timviec365/UserOnSite/Company/ManageCredits/PointToCreditMultiplier');
const Users = require('../../models/Users');

const getIP = (req) => {
    let forwardedIpsStr = req.header('x-forwarded-for');
    let ip = '';
    if (forwardedIpsStr) {
        ip = forwardedIpsStr.split(',')[0];
    } else {
        ip = req.socket.remoteAddress 
    }
    return ip;
}

// const getPTCMultiplier = async () => {
//     try {
//         return await PTCMultiplier.findOne({});
//     } catch (error) {
//         console.log(error);
//         return functions.setError(res, error)
//     }
// }

const recordCreditsHistory = async (usc_id, type, amount, admin_id, ip_user) => {
    let use_id = 0;
    let latestHistory = await CreditsHistory.findOne({}).sort({use_id: -1});
    if (latestHistory) use_id = latestHistory.use_id + 1;
    let doc = await (new CreditsHistory({
        //idTimViec365
        usc_id,
        use_id,
        amount,
        /**
         * Loại lịch sử: 
         * - 0: Sử dụng
         * - 1: Nạp tiền
         */
        type,
        used_day: functions.getTimeNow(),
        admin_id,
        ip_user,
    })).save()
    return doc
}

exports.recordCreditsHistory = recordCreditsHistory;

const recordCreditExchangeHistory = async (usc_id, point, money, point_later) => {
    let id = 0;
    let creditExchangeHistory = await CreditExchangeHistory.findOne({}).sort({id: -1})
    if (creditExchangeHistory) {
        id = creditExchangeHistory.id + 1;
    }
    let doc = await (new CreditExchangeHistory({
        id,
        userId: usc_id,
        userType: 1,
        point,
        money,
        point_later,
        is_used: 1,
        time: functions.getTimeNow(),
    })).save()
    return doc
}

//Validate và lấy ID timviec365
const getTimviec365Id = async (req, res) => {
    if (!req.user||!req.user.data) return functions.setError(res, "Công ty không tồn tại", 429);
    let usc_id = req.user.data.idTimViec365;
    let company = await Users.findOne({idTimViec365: usc_id, type: 1});
    if (!company) return functions.setError(res, "Không tồn tại công ty có ID này", 400);
    return usc_id;
}

const createNewPresPointHistory = async (usc_id) => {
    let id = 0;
    let pointHistory = await PresPointHistory.findOne().sort({id: -1});
    if (pointHistory) id = num(pointHistory.id) + 1;
    await new PresPointHistory({id, userId: usc_id}).save();
}

const handlePresPointUpdate = async (history, newPoints, amount) => {
    let percentage = 1 - (newPoints/ history.point_to_change);
    console.log(history.point_to_change);
    let points = history.point_to_change - newPoints;
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
    //Trừ đều điểm của tất cả trường điểm theo % thay đổi
    fields.forEach(field => {
        history[field] -= num(history[field])*percentage;
    })
    history.point_to_change = newPoints;
    await recordCreditExchangeHistory(history.userId, points, amount, newPoints);
    let usedPoints = await getTotalUsedPresPoint(history.userId);
    //Trường sum là tổng cả điểm đã dùng và chưa dùng
    history.sum = history.point_to_change + usedPoints;
    await history.save();
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

exports.useCredits = (amount) => {
    return async (req, res, next) => {
        try {
            let usc_id = await getTimviec365Id(req, res);
            let credits = await Credits.findOne({usc_id});
            if (!credits) {
                doc = await (new Credits({
                    usc_id: usc_id,
                    balance: 0,
                    status: 1,
                })).save();
                return functions.setError(res, "Tài khoản của bạn không đủ để thực hiện hành động này", 400);
            }
            if (credits.balance < amount)
                return functions.setError(res, "Tài khoản của bạn không đủ để thực hiện hành động này", 400);
            await recordCreditsHistory(usc_id, 0, amount, null, getIP(req));
            await Credits.findOneAndUpdate({usc_id}, {$inc: {balance: -amount}});
            next();
        } catch (error) {
            console.log(error);
            return functions.setError(res, error)
        }
    }
}

exports.updatePTCMultiplier = async (req, res) => {
    try {
        let {multiplier} = req.body;
        if (!multiplier) return functions.setError(res, "Thiếu các trường cần thiết", 429);
        await PTCMultiplier.findOneAndUpdate({}, {multiplier, history: {$push: multiplier}});
        return functions.success(res, "Thành công!")
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

exports.exchangePointToCredits = async (req, res) => {
    try {
        let {
            points
        } = req.body;
        let usc_id = await getTimviec365Id(req, res)
        if (points) {
            points = Number(points);
            //Kiểm tra xem trường point có phải số nguyên hay không
            if (!Number.isInteger(points)) return functions.setError(res, "Trường point phải là số nguyên", 429);
            let pointHistory = await PresPointHistory.findOne({userId: usc_id});
            //Nếu chưa tồn tại lịch sử điểm uy tín thì tạo mới và trả 400 vì chưa có điểm 
            if (!pointHistory) {
                await createNewPresPointHistory(usc_id);
                return functions.setError(res, "Không đủ điểm để quy đổi", 400);
            }
            let availablePoints = num(pointHistory.point_to_change);
            if (points > availablePoints) return functions.setError(res, "Không đủ điểm để quy đổi", 400);
    
            const multiplier = 1000;
            const amount = points*multiplier;
            //Trừ đi số điểm đã đổi
            await handlePresPointUpdate(pointHistory, availablePoints - points, amount);
            //Tăng credits cho người dùng
            await Credits.findOneAndUpdate({usc_id}, {$inc: {balance: amount}});
            //Ghi lại lịch sử
            await recordCreditsHistory(usc_id, 2, amount, null, getIP(req));
            return functions.success(res, "Đổi điểm thành công!")
        } else {
            return functions.setError(res, "Thiếu các trường cần thiết", 429);
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

exports.getCreditBalance = async (req, res) => {
    try {
        let usc_id = await getTimviec365Id(req, res);
        let doc = await Credits.findOne({usc_id});
        return functions.success(res, "Thành công!", {data: doc});
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

exports.getCreditsHistory = async (req, res) => {
    try {
        let usc_id = await getTimviec365Id(req, res);
        let docs = await CreditsHistory.find({usc_id}).sort({used_day: -1});
        return functions.success(res, "Thành công!", {data: docs});
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

exports.getPresPointHistory = async (req, res) => {
    try {
        let usc_id = await getTimviec365Id(req, res);
        let docs = await PresPointHistory.find({userId: usc_id});
        let points = await getTotalUsedPresPoint(usc_id);
        return functions.success(res, "Thành công!", {points, record: docs});
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

exports.getCreditExchangeHistory = async (req, res) => {
    try {
        let usc_id = await getTimviec365Id(req, res);
        let docs = await CreditExchangeHistory.find({userId: usc_id});
        return functions.success(res, "Thành công!", {data: docs});
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

exports.success = async (req, res) => {
    try {
        return functions.success(res, "Thành công!");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

// exports.topupCredits = async (req, res) => {
//     try {
//         let {
//             usc_id,
//             amount
//         } = req.body;
//         if (!usc_id||!amount) return functions.setError(res, "Thiếu các trường cần thiết", 429);
//         let company = await Users.findOne({idTimViec365: usc_id, type: 1});
//         if (!company) return functions.setError(res, "Không tồn tại công ty có ID này", 400);
//         let admin_id = '';
//         if (req.user&&req.user.data) {
//             admin_id = req.user.data.adm_id;
//         }
//         let doc = await Credits.findOne({usc_id});
//         if (!doc) {
//             doc = await (new Credits({
//                 usc_id: usc_id,
//                 balance: amount,
//                 status: 1,
//             })).save();
//         } else {
//             await Credits.findOneAndUpdate({usc_id}, {$inc: {balance: amount}});
//         }
//         await recordCreditsHistory(usc_id, 1, amount, admin_id, getIP(req));
//         return functions.success(res, "Nạp tiền thành công!")
//     } catch (error) {
//         console.log(error);
//         return functions.setError(res, error)
//     }
// }