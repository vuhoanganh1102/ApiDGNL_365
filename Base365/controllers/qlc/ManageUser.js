const manageUser = require("../../models/Users")
const functions = require("../../services/functions")
const md5 = require('md5');

//tìm danh sách admin va nv
exports.getlistAdmin = async(req, res) => {
    try {
        const pageNumber = req.body.pageNumber || 1;
        const type = req.user.data.type
        let com_id = req.user.data.com_id
        // let com_id = req.body.com_id
        let idQLC = req.body.idQLC;
        let dep_id = req.body.dep_id
        let role = req.body.role
        if(type == 1){

        let condition = {};
        //Function tìm user là TK nhân viên và TK Cty
        if (com_id) {
            if (idQLC) condition.idQLC = idQLC
            if (dep_id) condition.dep_id = "inForPerson.employee.dep_id"
            if (role) condition.role = role
            const data = await manageUser.find(condition).select('userName phoneTK email inForPerson.employee.dep_id inForPerson.employee.position_id ').skip((pageNumber - 1) * 20).limit(20).sort({ _id: 1 });
            if (data) {
                return await functions.success(res, 'Lấy thành công', { data, pageNumber });
            };
            return functions.setError(res, 'Không có dữ liệu', 404);
        }
        return functions.setError(res, "")
    }
    return functions.setError(res, "Tài khoản không phải Công ty", 604);
    } catch (err) {
        console.log(err);
        functions.setError(res, err.message)
    }
};
//tao nv
exports.createUser = async(req, res) => {
try{
    const type = req.user.data.type

    let com_id = req.user.data.com_id
    // let com_id = req.body.com_id
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


exports.deleteAllUser = async(req, res) => {
    if (!await functions.getMaxID(manageUser)) {
        functions.setError(res, "No manager existed", 513);
    } else {
        manageUser.deleteMany()
            .then(() => functions.success(res, "Delete all companies successfully"))
            .catch(err => functions.setError(res, err.message, 514));
    }
}