const Users = require("../../models/Users")
const UserCompanyMulti = require("../../models/Timviec365/UserCompanyMulti")
const UserCompanyAddressBranch = require("../../models/Timviec365/UserCompanyAddressBranch")
const functions = require("../../services/functions")

const getCompanyId = async (req, res) => {
    if (!req.user||!req.user.data) return functions.setError(res, "Công ty không tồn tại", 429);
    let usc_id = req.user.data.idTimViec365;
    let company = await Users.findOne({idTimViec365: usc_id, type: 1});
    if (!company) return functions.setError(res, "Không tồn tại công ty có ID này", 400);
    return usc_id;
}


const handleGetUserCompanyMulti = async (usc_id) => {
    let userCM = await UserCompanyMulti.findOne({usc_id});
    if (!userCM) {
        await createNewUserCompanyMulti(usc_id);
        userCM = await UserCompanyMulti.findOne({usc_id});
    }
    return userCM;
}

const createNewUserCompanyMulti = async (usc_id, data = {}) => {
    let pri_id = 0;
    let latestCM = await UserCompanyMulti.findOne({}).sort({pri_id: -1});
    if (latestCM) pri_id = latestCM.pri_id + 1;
    let payload = {
        pri_id,
        usc_id,
        ...data
    }
    await (new UserCompanyMulti(payload)).save();
}

const handleGetUserCompanyAddressBranch = async (usc_id) => {
    let userCAB = await UserCompanyAddressBranch.findOne({usc_id});
    if (!userCAB) {
        await createNewUserCompanyAddressBranch(usc_id);
        userCAB = await UserCompanyAddressBranch.findOne({usc_id});
    }
    return userCAB;
}

const createNewUserCompanyAddressBranch = async (usc_id, data = {}) => {
    let id = 0;
    let latestCAB = await UserCompanyAddressBranch.findOne({}).sort({id: -1});
    if (latestCAB) id = latestCAB.id + 1;
    let payload = {
        id,
        usc_id,
        ...data,
        usc_branch_time: functions.getTimeNow()
    }
    await (new UserCompanyAddressBranch(payload)).save();
}

exports.getUSCIDFromToken = async (req, res, next) => {
    if (!req.user||!req.user.data) return functions.setError(res, "Công ty không tồn tại", 429);
    req.body.usc_id = req.user.data.idTimViec365;
    next();

}

exports.getUserCompanyMulti = async (req, res) => {
    try {
        let usc_id = await getCompanyId(req, res);
        let data = await handleGetUserCompanyMulti(usc_id);
        return functions.success(res, "Thành công", {data});
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

exports.editUserCompanyMulti = async (req, res) => {
    try {
        let {
            usc_id,

            usc_company_info,
            usc_map,
            usc_dgc,
            usc_dgtv,
            usc_dg_time,
            usc_skype,
            usc_video_com,
            usc_lv,
            usc_zalo
        } = req.body;
        let data = {usc_company_info, usc_map, usc_dgc, usc_dgtv, usc_dg_time, usc_skype, usc_video_com, usc_lv, usc_zalo};
        let exists = await UserCompanyMulti.findOne({usc_id});
        if (exists) {
            await UserCompanyMulti.updateOne({usc_id}, data);
        } else {
            await createNewUserCompanyMulti(usc_id, data);
        }
        return functions.success(res, "Thành công", {data});
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

exports.getUserCompanyAddressBranch = async (req, res) => {
    try {
        let usc_id = await getCompanyId(req, res);
        let data = await handleGetUserCompanyAddressBranch(usc_id);
        return functions.success(res, "Thành công", {data});
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

exports.editUserCompanyAddressBranch = async (req, res) => {
    try {
        let {
            usc_id,

            usc_branch_cit,
            usc_branch_qh,
            usc_branch_address,
        } = req.body;
        let data = {usc_branch_cit, usc_branch_qh, usc_branch_address};
        let exists = await UserCompanyAddressBranch.findOne({usc_id});
        if (exists) {
            await UserCompanyAddressBranch.updateOne({usc_id}, data);
        } else {
            await createNewUserCompanyAddressBranch(usc_id, data);
        }
        return functions.success(res, "Thành công", {data});
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}
