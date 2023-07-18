const functions = require("../../services/functions")
const setIp = require("../../models/qlc/SettingIP")



//lấy danh sách 

exports.getListByID = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
        // const com_id = req.body.com_id
        const type = req.user.data.type
        if (type == 1) {
            const id_acc = req.body.id_acc;
            let condition = {}
                if (id_acc) condition.id_acc = id_acc
                if (com_id) condition.com_id = com_id
                const data = await setIp.find(condition).select('id_acc from_site ip_access created_time update_time').sort({id_acc: -1}).lean();
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
        const data1 = req.body.data1
        const type = req.user.data.type
        if (type == 1) {
    const {  ip_access, from_site } = req.body;
    let now = new Date();
    if (ip_access && from_site && com_id) {
        const maxId = await setIp.findOne({},{},{sort : {id_acc : -1}}).lean() || 0;
        const id_acc = Number(maxId.id_acc) + 1 || 1;
        // data1.forEach(async (item) => {//// them nhieu ip
        //     const newData = new setIp({
        //         id_acc: id_acc,
        //         from_site: item.from_site,
        //         ip_access: item.ip_access,
        //         created_time: Date.parse(now)/1000,
        //     });   
          
        //     await newData.save();
        // });
        const newData = new setIp({ //them 1 ip
            id_acc: id_acc,
            com_id: com_id,
            from_site: from_site,
            ip_access: ip_access,
            created_time: Date.parse(now)/1000,
        })
        await newData.save()
        return functions.success(res, 'Tạo thành công', { newData })
    }
    return functions.setError(res, "thiếu thông tin IP hoặc from_site ")
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
    const {id_acc,ip_access, from_site } = req.body;
    if (ip_access && from_site && com_id) {
    let now = new Date();
        const settingIP = await functions.getDatafindOne(setIp, { com_id: com_id, id_acc: id_acc });
        if (settingIP) {
            await functions.getDatafindOneAndUpdate(setIp, { com_id: com_id, id_acc: id_acc }, {
                    from_site: from_site,
                    // nameApp: nameApp,
                    ip_access: ip_access,
                    update_time: Date.parse(now)/1000,

                })
                return functions.success(res, " sửa thành công ", { settingIP })
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
        const com_id = req.user.data.com_id
        // const com_id = req.body.com_id
        const type = req.user.data.type
        if (type == 1) {
    const id_acc = req.body.id_acc;

    if (com_id&&id_acc) {
        
        const settingIp = await functions.getDatafind(setIp, { com_id: com_id, id_acc: id_acc });
        if (settingIp) {
            await functions.getDataDeleteOne(setIp, { com_id: com_id, id_acc: id_acc })
            return functions.success(res, "xóa thành công", { settingIp })
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