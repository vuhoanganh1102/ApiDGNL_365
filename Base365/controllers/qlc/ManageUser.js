const manageUser = require("../../models/Users")
const functions = require("../../services/functions")
const md5 = require('md5');

//tìm danh sách admin va nv
exports.getlistAdmin = async(req, res) => {
    try {
        const pageNumber = req.body.pageNumber || 1;
        const type = req.user.data.type
        // let com_id = req.user.data.com_id
        let com_id = req.body.com_id
        let findbyNameUser = req.body.findbyNameUser
        let findbyNameDeparment = req.body.findbyNameDeparment
        if(type == 1){
        let condition = {};
        if (com_id) {
            if (com_id) condition.com_id = Number(com_id)
            if (findbyNameUser) condition["userName"] = { $regex: findbyNameUser };//tìm kiếm theo tên 
            if (findbyNameDeparment) condition["nameDeparment"] = { $regex: findbyNameDeparment };//tìmm kiếm theo tên phòng ban 
            let data = await manageUser.aggregate([
                { $lookup: { 
                    from: "QLC_Deparments", 
                    localField: "inForPerson.employee.dep_id", 
                    foreignField: "dep_id", 
                    as: "nameDeparment" }},
                { $project: { 
                    "userName": "$userName", 
                    "dep_id": "$inForPerson.employee.dep_id", 
                    "com_id": "$inForPerson.employee.com_id", 
                    "position_id": "$inForPerson.employee.position_id", 
                    "phoneTK" : "$phoneTK",
                    "email" : "$email",
                    "idQLC": "$idQLC", 
                    "nameDeparment": "$nameDeparment.dep_name", 
                }},
                {$match: condition},
            ]).skip((pageNumber - 1) * 10).limit(10).sort({ _id: -1 });
            if (data) {
                return await functions.success(res, 'Lấy thành công', { data, pageNumber });
            };
            return functions.setError(res, 'Không có dữ liệu');
        }
        return functions.setError(res, "thiếu com_id")
    }
    return functions.setError(res, "Tài khoản không phải Công ty");
    } catch (err) {
        console.log(err);
        functions.setError(res, err.message)
    }
};
//tao nv
exports.createUser = async(req, res) => {
try{
    const type = req.user.data.type

    // let com_id = req.user.data.com_id
    let com_id = req.body.com_id
    const {  userName, email, phoneTK, idQLC, password, role, address, birthday, dep_id, group_id, team_id, position_id, gender, ep_status, createdAt } = req.body;
    if(type == 1){

    if (com_id && userName && email && password && role && address && position_id && gender) {
        //Kiểm tra tên nhân viên khác null
  
        const manager = await functions.getDatafindOne(manageUser, { email: email, type: 2 });
        if (!manager) {
               //Lấy ID kế tiếp, nếu chưa có giá trị nào thì bằng 0 có giá trị max thì bằng max + 1 
               let maxID = await functions.getMaxID(manageUser);
               if (!maxID) {
                   maxID = 0
               };
               const _id = Number(maxID) + 1;
               const ManagerUser = new manageUser({
                   _id: _id,
                   idQLC: Number(maxID) + 1 || idQLC,
                   "inForPerson.employee.com_id": com_id,
                   userName: userName,
                   email: email,
                   phoneTK: phoneTK,
                   password: md5(password),
                   "inForPerson.account.gender": gender,
                   "inForPerson.account.birthday": birthday,
                   address: address,
                   "inForPerson.employee.position_id": position_id,
                   type: 2,
                   "inForPerson.employee.dep_id": dep_id,
                   "inForPerson.employee.group_id": group_id,
                   "inForPerson.employee.team_id": team_id,
                   "inForPerson.employee.ep_status": ep_status,
                   role: role,
                   createdAt: Date.now()
               });
   
               await ManagerUser.save()
                    return functions.success(res, "user created successfully", { ManagerUser })
        }
        return functions.setError(res, "email đã tồn tại!", 510);

    }
    return functions.setError(res, "Cần nhập đủ thông tin", 506);
}
return functions.setError(res, "Tài khoản không phải Công ty", 604);
}catch(e) {
    return functions.setError(res,e.message);

}
};


// chỉnh sửa
exports.editUser = async(req, res) => {
try{
    const type = req.user.data.type
    let com_id = req.user.data.com_id
    // let com_id = req.body.com_id
    const {userName, email, phoneTK, idQLC, password, role, address, birthday, dep_id, group_id, team_id, position_id, gender, createdAt,ep_status } = req.body;
    if(type == 1){

    if ((com_id && userName && email && idQLC && password && role && address && position_id && gender) == undefined) {
        //Kiểm tra tên nhân viên khác null
        const manager = await functions.getDatafindOne(manageUser, { idQLC: idQLC, type: 2 });
        if (manager) {
            await functions.getDatafindOneAndUpdate(manageUser, { idQLC: idQLC, type: 2 }, {
                "inForPerson.employee.com_id": com_id,
                userName: userName,
                email: email,
                phoneTK: phoneTK,
                password: md5(password),
                "inForPerson.account.gender": gender,
                "inForPerson.account.birthday": birthday,
                address: address,
                "inForPerson.employee.position_id": position_id,
                type: 2,
                "inForPerson.employee.dep_id": dep_id,
                "inForPerson.employee.group_id": group_id,
                "inForPerson.employee.team_id": team_id,
                "inForPerson.employee.ep_status": ep_status,
                role: role,

            })
            return functions.success(res, "Sửa thành công", { manager })
        }
        return functions.setError(res, "người dùng không tồn tại", 510);
    }
    return functions.setError(res, "thiếu thông tin", 506);
}
return functions.setError(res, "Tài khoản không phải Công ty", 604);
}catch(e){
return functions.setError(res, e.message);
    
}
}

//xoa nhan vien
exports.deleteUser = async(req, res) => {
try{
        //tạo biến đọc idQLC
        const type = req.user.data.type
        let com_id = req.user.data.com_id
        // let com_id = req.body.com_id
        const idQLC = req.body.idQLC;
        if(type == 1){
            const manager = await functions.getDatafindOne(manageUser, { "inForPerson.employee.com_id": com_id, idQLC: idQLC, type: 2 });
            if (manager) { //nếu biến manager không tìm thấy  trả ra fnc lỗi 
                functions.getDataDeleteOne(manageUser, { idQLC: idQLC })
                return functions.success(res, "xóa thành công!", { manager })
            }
            return functions.setError(res, "người dùng không tồn tại!", 510);
    }
    return functions.setError(res, "Tài khoản không phải Công ty", 604);
}catch(e){
    return functions.setError(res, e.message);

}
};

// exports.deleteCompanyALlUser = async(req, res) => {
//     try {
//         const com_id = req.user.data.com_id
//         // const com_id = req.body.com_id
//         const type = req.user.data.type
//         if (type == 1) {

//             const user = await functions.getDatafind(manageUser, { "inForPerson.employee.com_id": com_id });
//             if (user) {
//                 await manageUser.deleteMany({ "inForPerson.employee.com_id": com_id })
//                 return functions.success(res, "xóa thành công ", {user})
//             }
//             return functions.setError(res, "không tìm thấy nhân viên nào trong công ty");
//         }
//         return functions.setError(res, "Tài khoản không phải Công ty", 604);
//     } catch (error) {
//         return functions.setError(res, error.message)
//     }
//     }

