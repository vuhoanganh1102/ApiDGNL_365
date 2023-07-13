const functions = require("../../services/functions")
const setIp = require("../../models/qlc/SettingIP")



//lấy danh sách 

exports.getListByID = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
        // const com_id = req.body.com_id
        const type = req.user.data.type
        if (type == 1) {
            const _id = req.body.id || null;
            let condition = {}
                if (_id) condition._id = _id
                if (com_id) condition.com_id = com_id
                const data = await setIp.find(condition).select('_id fromSite accessIP createAt updateAt').sort({_id: -1}).lean();
                if (data) {
                    return functions.success(res, 'tạo thành công ', { data })
                }
                return functions.setError(res, 'không tìm thấy cài đặt IP')
            }
            return functions.setError(res, "Tài khoản không phải Công ty");
        } catch (error) {
            console.log(error);
            functions.setError(res, error.message);
        }
    }
//tạo 1 thiết lập Ip
exports.createIP = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
        // const com_id = req.body.com_id
        const type = req.user.data.type
        if (type == 1) {
    const {  accessIP, fromSite } = req.body;
    // let nameApp = "";
    if (accessIP && fromSite && com_id) {
        const maxId = await functions.getMaxID(setIp);
        const _id = Number(maxId) + 1 || 1;
        const settingIP = new setIp({
            _id: _id,
            com_id: com_id,
            fromSite: fromSite,
            accessIP: accessIP,
            createAt: new Date().toJSON().slice(0, 10),
        })
        await settingIP.save()
        return functions.success(res, 'create successful', { settingIP })
    }
    return functions.setError(res, "thiếu thông tin")
}
return functions.setError(res, "Tài khoản không phải Công ty");

} catch (error) {
return functions.setError(res, error.message)
}

}
exports.editsettingIP = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
        // const com_id = req.body.com_id
        const type = req.user.data.type
    if (type == 1) {
    const {_id,accessIP, fromSite } = req.body;
    if (accessIP && fromSite && com_id) {
        const settingIP = await functions.getDatafindOne(setIp, { com_id: com_id, _id: _id });
        if (settingIP) {
            await functions.getDatafindOneAndUpdate(setIp, { com_id: com_id, _id: _id }, {
                    fromSite: fromSite,
                    // nameApp: nameApp,
                    accessIP: accessIP,
                    updateAt: new Date(),
                })
                return functions.success(res, "setIp edited successfully", { settingIP })
        }
        return functions.setError(res, "setIp does not exist!");

    }
    return functions.setError(res, "thiếu thông tin")
}
return functions.setError(res, "Tài khoản không phải Công ty");

} catch (error) {
return functions.setError(res, error.message)
}

}


exports.deleteSetIpByID = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
        // const com_id = req.body.com_id
        const type = req.user.data.type
        if (type == 1) {
    const _id = req.body._id;

    if (com_id&&_id) {
        
        const settingIp = await functions.getDatafind(setIp, { com_id: com_id, _id: _id });
        if (settingIp) {
            await functions.getDataDeleteOne(setIp, { com_id: com_id, _id: _id })
            return functions.success(res, "setIp deleted successfully", { settingIp })
        }
        return functions.setError(res, "No setIp found in this company");
    }
    return functions.setError(res, "Company and _id required");
}
return functions.setError(res, "Tài khoản không phải Công ty");

} catch (error) {
return functions.setError(res, error.message)
}


}