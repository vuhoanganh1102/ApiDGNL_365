const functions = require("../../services/functions");
// const users = require("../../models/Users")
// const calEmp = require("../../models/qlc/CalendarWorkEmployee")
const Tracking = require("../../models/qlc/TrackingWifi")
    // đổ danh sách wifi chấm công 
exports.getlist = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
        const type = req.user.data.type
        // let com_id = req.body.com_id
        let wifi_id = req.body.wifi_id
        let condition = {};
        if (type == 1) {

            if (com_id) condition.com_id = com_id
            if (wifi_id) condition.wifi_id = wifi_id

            const data = await Tracking.find(condition).lean();
            if (data) {
                return functions.success(res, 'Lấy thành công', { data });
            };
            return functions.setError(res, 'Không có dữ liệu');
        }
        return functions.setError(res, "Tài khoản không phải Công ty");

    } catch (err) {

        return functions.setError(res, err.message)
    }


}

//tạo để test
exports.Create = async(req, res) => {
    try{
    const com_id = req.user.data.com_id
    const {name_wifi, ip_address, mac_address, create_time, is_default, status } = req.body;


    if (com_id && name_wifi && ip_address) {
        
        let maxId = await Tracking.findOne({},{},{sort: {wifi_id : -1}}).lean() || 0
        const wifi_id = Number(maxId.wifi_id) + 1 || 1 ;
        const tracking = new Tracking({
            wifi_id: wifi_id,
            com_id: com_id,
            status: status,
            name_wifi: name_wifi,
            create_time: new Date(),
            is_default: is_default,
            ip_address: ip_address,
            mac_address: mac_address,
        });
        await tracking.save()
               return functions.success(res, "tạo thành công", {tracking})
        }
        return functions.setError(res, "thiếu trường tên wifi và địa chỉ IP");
    }catch(e){
        return functions.setError(res, e.message);
            
        }
};

exports.edit = async(req, res) => {
    try{
        const com_id = req.user.data.com_id
        const wifi_id = req.body.wifi_id

        const {name_wifi, ip_address, mac_address, is_default, status } = req.body;
        const data = await functions.getDatafindOne(Tracking, { wifi_id: wifi_id });
        if (data) {
            await functions.getDatafindOneAndUpdate(Tracking, { com_id: com_id, wifi_id: wifi_id }, {
                com_id: com_id,
                status: status,
                name_wifi: name_wifi,
                is_default: is_default,
                ip_address: ip_address,
                mac_address: mac_address,
            })
            return functions.success(res, "Sửa thành công", { data })
        }
        return functions.setError(res, "wifi không tồn tại");
    }catch(e){
        return functions.setError(res, e.message);
            
        }
};
exports.delete = async (req, res) => {
    try {
        const com_id = req.user.data.com_id
        // const com_id = req.body.com_id
        const wifi_id = req.body.wifi_id
            if (com_id && wifi_id) {
                const data = await functions.getDatafindOne(Tracking, { wifi_id: wifi_id });
                if (data) {
                    functions.getDataDeleteOne(Tracking, { com_id: com_id, wifi_id: wifi_id })
                    return functions.success(res, "xóa thành công !", { data })
                }
                return functions.setError(res, "không tồn tại!", 510);
            }
            return functions.setError(res, "Thiếu trường Wifi_id ", );
    } catch (error) {
        return functions.setError(res, error.message)
    }
};