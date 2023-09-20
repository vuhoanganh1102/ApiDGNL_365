const functions = require("../../services/functions")
const SettingIP = require("../../models/qlc/SettingIP")



//lấy danh sách 

exports.getListByID = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
            // const com_id = req.body.com_id

        const type = req.user.data.type
        if (type == 1) {
            const id_acc = req.body.id_acc;
            let condition = { id_com: com_id }
            if (id_acc) condition.id_acc = id_acc;
            const data = await SettingIP.find(condition).select('id_acc from_site ip_access created_time update_time').sort({ id_acc: -1 }).lean();
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
        const com_id = req.user.data.com_id;
        const type = req.user.data.type;
        if (type == 1) {
            const list = req.body;
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const element = list[index];
                    const maxId = await SettingIP.findOne({}, { id_acc: 1 }, { sort: { id_acc: -1 } }).lean();
                    const id_acc = Number(maxId.id_acc) + 1;
                    const newData = new SettingIP({
                        id_acc: id_acc,
                        id_com: com_id,
                        ip_access: element.ip_access,
                        from_site: element.from_site,
                        created_time: functions.getTimeNow()
                    });
                    await newData.save();
                }
                return functions.success(res, "Thành công");
            }
            return functions.setError(res, "thiếu thông tin IP hoặc from_site ");
        }
        return functions.setError(res, "Tài khoản không phải Công ty");

    } catch (error) {
        return functions.setError(res, error.message)
    }
}

exports.editsettingIP = async(req, res) => {
    try {
        const com_id = req.user.data.com_id;
        const type = req.user.data.type;
        if (type == 1) {
            const { id_acc, ip_access, from_site } = req.body;
            if (ip_access && from_site && com_id) {
                const settingIP = await functions.getDatafindOne(SettingIP, { id_com: com_id, id_acc: id_acc });
                if (settingIP) {
                    await functions.getDatafindOneAndUpdate(SettingIP, { id_com: com_id, id_acc: id_acc }, {
                        from_site: from_site,
                        ip_access: ip_access,
                        update_time: new Date(),
                    })
                    return functions.success(res, " sửa thành công ");
                }
                return functions.setError(res, "IP không tồn tại!");
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
        const com_id = req.user.data.com_id;
        const type = req.user.data.type;
        if (type == 1) {
            const id_acc = req.body.id_acc;

            if (com_id && id_acc) {
                const settingIp = await functions.getDatafind(SettingIP, { id_com: com_id, id_acc: id_acc });
                if (settingIp) {
                    await functions.getDataDeleteOne(SettingIP, { id_com: com_id, id_acc: id_acc })
                    return functions.success(res, "xóa thành công")
                }
                return functions.setError(res, "không tìm thấy IP");
            }
            return functions.setError(res, "nhập id_acc cần xóa");
        }
        return functions.setError(res, "Tài khoản không phải Công ty");

    } catch (error) {
        return functions.setError(res, error.message)
    }
}