const Device = require("../../models/qlc/CheckDevice")
const timeSheet = require("../../models/qlc/HisTracking")
const Users = require("../../models/Users")
const functions= require ("../../services/functions")

exports.getlist = async(req, res) => {
    try {
        const com_id = req.body.com_id
        const type = req.user.data.type
        let dep_id = req.body.dep_id
        let findbyNameUser = req.body.findbyNameUser
        let condition = {};
        let data2 = [];
        if (type == 1) {

            if (com_id) condition["com_id"] = Number(com_id)
            if (dep_id) condition.dep_id = Number(dep_id)
            if (findbyNameUser) condition["userName"] = { $regex: findbyNameUser };
            console.log(condition)
            let data = await Users.aggregate([
                { $lookup: { 
                    from: "qlc_employee_devices", 
                    localField: "idQLC", 
                    foreignField: "ep_id", 
                    as: "listDevice" }},
                { $project: { 
                    "userName": "$userName", 
                    "dep_id": "$inForPerson.employee.dep_id", 
                    "com_id": "$inForPerson.employee.com_id", 
                    "idQLC": "$idQLC", 
                    "ed_id": "$listDevice.ed_id", 
                    "current_device": "$listDevice.current_device", 
                    "current_device_name": "$listDevice.current_device_name", 
                    "new_device": "$listDevice.new_device", 
                    "new_device_name": "$listDevice.new_device_name", 
                }},
                {$match: condition},
            ]);
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

//tao moi yeu cau
exports.createDevice = async (req,res)=>{
    try {
    const {ep_id , current_device_name , new_device_name,current_device,new_device,type_device } =req.body 
    //check loi 
    if(ep_id && current_device) {
        let maxID = await Device.findOne({},{},{sort : {ed_id : -1}}).lean() || 0

        const ed_id = Number(maxID.ed_id) + 1 || 1;
        const device = new Device({
            ed_id: ed_id,
            ep_id:ep_id,
            current_device: current_device,
            new_device: new_device,
            current_device_name: current_device_name,
            new_device_name: new_device_name,
            type_device : type_device,
        })
        await device.save()
           return functions.success(res,"tạo thành công",{device})
    }
    return functions.setError(res,"vui lòng nhập đủ ep_id và current_device")
} catch (err) {

    return functions.setError(res, err.message)
}

}
//duyet 
exports.add = async (req,res)=>{
    try {
        ed_id = req.body.ed_id
            const data = await functions.getDatafindOne(Device, {ed_id :ed_id });
            if (data) {
                newIDDevice = data.new_device
                newNameDevice = data.new_device_name
                await functions.getDatafindOneAndUpdate(Device, { ed_id : ed_id }, {
                    current_device: newIDDevice,
                    current_device_name: newNameDevice,
                    new_device: null,
                    new_device_name: null,
                })
                await functions.getDatafindOneAndUpdate(timeSheet, { ed_id : ed_id , status : 2, ts_image : ''}, {
                    is_success: 1,
                })
                return functions.success(res, "duyệt thành công");
            }
            return functions.setError(res, "ed_id không tồn tại ");
} catch (err) {
    return functions.setError(res, err.message)
}

}

exports.delete = async (req, res) => {
    try {
        const ed_id = req.body.ed_id
            if (ed_id) {
                const data = await functions.getDatafindOne(Device, { ed_id: ed_id });
                if (data) {
                    functions.getDataDeleteOne(Device, { ed_id: ed_id })
                    return functions.success(res, "xóa thành công !", { data })
                }
                return functions.setError(res, "không tồn tại!", 510);
            }
            return functions.setError(res, "Thiếu trường ed_id ", );
    } catch (error) {
        return functions.setError(res, error.message)
    }
};