const fnc = require('../../services/fnc');
const New = require('../../models/Raonhanh365/UserOnSite/New');

// thông tin tài khoản
exports.comInfo = async(req, res, next) => {
    try {
        // chưa xong
        const user = req.user.data;
        const conditions = {
            $or: [
                { $and: [{ buySell: 1 }, { userID: user._id }] },
                { $and: [{ buySell: 2 }, { userID: user._id }] },
                { userID: user._id }
            ]
        };
        const data = await New.countDocuments(conditions);
        data.user = user;
        return await fnc.success(res, "Thành công", data);
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};