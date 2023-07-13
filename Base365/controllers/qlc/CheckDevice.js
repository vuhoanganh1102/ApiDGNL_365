const Device = require("../../models/qlc/CheckDevice")
const functions= require ("../../services/functions")


//loc danh sach theo cty 
exports.getALlCompanyDevice = async (req,res)=>{
    const {com_id} =req.body
    
    if (!com_id) {
        functions.setError(res, "company Id required")
    }else if (isNaN(com_id)) {
        functions.setError(res, "company Id must be a number")
    }else {
        const companyDevice = await functions.getDatafind(Device,{com_id : com_id});
        if(!companyDevice){
            functions.setError(res,"company device cannot be found or does not existed")
        }else {
            functions.success(res,  " company Device found",companyDevice)
        }
    }
};
//loc danh sach theo cty va phong ban
exports.getALlCompanyDevice = async (req,res)=>{
    const {com_id, dep_id} =req.body
    if (!com_id) {
        functions.setError(res, "company Id required")
    }else if (isNaN(com_id) ) {
        functions.setError(res, "company Id must be a number")
    }else if (!dep_id) {
        functions.setError(res,"department Id required")
    }else if (isNaN(dep_id) ) {
        functions.setError(res, "department Id must be a number")

    }else {
        const companyDevice = await functions.getDatafind(Device,{com_id : com_id},{dep_id : dep_id});
        if(!companyDevice){
            functions.setError(res,"company device cannot be found or does not existed")
        }else {
            functions.success(res,  " company Device found",companyDevice)
        }
    }
};
// ////loc danh sach theo cty va phong ban 
// exports.getAllDepDevice = async (req,res)=>{
//     const {com_id, dep_id} =req.body;

//     if (!com_id) {
//         functions.setError(res, "company Id required")
//     }else if (isNaN(com_id)) {
//         functions.setError(res, "company Id must be a number")
//     }else if (!dep_id) {
//         functions.setError(res,"department Id required")
//     }else if (isNaN(dep_id)) {
//         functions.setError(res, "department Id must be a number")
//     // }else if (!_id) {
//     //     functions.setError(res," _Id required")
//     // }else if (isNaN(_id)) {
//     //     functions.setError(res, "_Id must be a number")

//     }else {
//         const companyDevice = await functions.getDatafindOne(Device,{com_id : com_id},{dep_id : dep_id});
//         if(!companyDevice){
//             functions.setError(res,"company device cannot be found or does not existed")
//         }else {
//             functions.success(res,  " company Device found",companyDevice)
//         }
//     }
// };
//lấy thiết bị theo Id 
exports.getDeviceById = async (req,res)=>{
    const _id = req.params.id
    
    if (isNaN(_id)) {
        functions.setError(res,"id must be  a number")
    } else {
        const device = await functions.getDatafindOne(Device,{_id : _id})
        if(!device){
            functions.setError(res,"devive not found or doesnt existed")
        }else{
            functions.success(res,"device found",device)
        }
    }

}
//tao moi yeu cau
exports.createDevice = async (req,res)=>{
    const {idQLC ,  curDeviceName , newDeviceName,current_device,new_device } =req.body 
    //check loi 
    if(idQLC) {
        
        let maxID = await functions.getMaxID(Device)
        if(!maxID) {
            maxID = 0
        }
        const ed_id = Number(maxID) + 1;
        
        const device = new Device({
            ed_id: ed_id,
            idQLC:idQLC,
            current_device: current_device,
            new_device: new_device,
            curDeviceName: curDeviceName,
            newDeviceName: newDeviceName,
        })
        
        await device.save()
           return functions.success(res,"create check device successful",{device})
        
    }
    return functions.setError(res,"idQLC required")
}
//chinh sua yeu cau 
exports.editDevice = async (req,res)=>{
    const _id = req.params.id;
        const {idQLC , dep_id , curDeviceName , newDeviceName} = req.body;
            const device = await functions.getDatafindOne(Device,{_id : _id})
            if(!device){
                functions.setError(res,"check device doesnt existed")
            }else{
            
                await functions.getDatafindOneAndUpdate(Device,{_id : _id},{
                    idQLC: idQLC,
                    dep_id: dep_id,
                    curDeviceName: curDeviceName,
                    newDeviceName: newDeviceName
                })
                .then((device)=> functions.success(res,"check device edited successful", device ))
                .catch((err)=> functions.setError(res,err.message));
    }
}
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
