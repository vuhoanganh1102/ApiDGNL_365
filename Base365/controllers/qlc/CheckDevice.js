const Device = require("../../models/qlc/CheckDevice")
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
                    foreignField: "idQLC", 
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
    const {idQLC ,  current_device_name , new_device_name,current_device,new_device,type_device } =req.body 
    //check loi 
    if(idQLC && current_device) {
        let maxID = await Device.findOne({},{},{sort : {ed_id : -1}}).lean() || 0

        const ed_id = Number(maxID.ed_id) + 1 || 1;
        const device = new Device({
            ed_id: ed_id,
            idQLC:idQLC,
            current_device: current_device,
            new_device: new_device,
            current_device_name: current_device_name,
            new_device_name: new_device_name,
            type_device : type_device,
        })
        await device.save()
           return functions.success(res,"tạo thành công",{device})
    }
    return functions.setError(res,"vui lòng nhập đủ idQLC và current_device")
} catch (err) {

    return functions.setError(res, err.message)
}

}
// //chinh sua yeu cau 
// exports.editDevice = async (req,res)=>{
//     const _id = req.params.id;
//         const {idQLC , dep_id , current_device_name , new_device_name} = req.body;
//             const device = await functions.getDatafindOne(Device,{_id : _id})
//             if(!device){
//                 functions.setError(res,"check device doesnt existed")
//             }else{
            
//                 await functions.getDatafindOneAndUpdate(Device,{_id : _id},{
//                     idQLC: idQLC,
//                     dep_id: dep_id,
//                     current_device_name: current_device_name,
//                     new_device_name: new_device_name
//                 })
//                 .then((device)=> functions.success(res,"check device edited successful", device ))
//                 .catch((err)=> functions.setError(res,err.message));
//     }
// }
//xoa yeu cau cau dang ki thiet bi
exports.deleteDevice = async (req,res)=>{
    const _id = req.params.id;

    if(isNaN(_id)){
        functions.setError(res,"id must be a number");
    }else {
        const devices = await functions.getDatafindOne(Device,{_id :_id})
        if(!devices) {
            functions.setError(res, "check device doesnt exist")
        }else {
            await functions.getDataDeleteOne(Device, {_id :_id})
            .then(()=> functions.success(res,"delete check device successful",devices))
            .catch((err)=>functions.setError(res,err.message))
        }
    }
}
