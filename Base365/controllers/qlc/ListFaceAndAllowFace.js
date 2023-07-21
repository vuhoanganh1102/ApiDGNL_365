const Users = require("../../models/Users")
const functions = require("../../services/functions")
const fnc = require('../../services/qlc/functions')

//lấy danh sách nhân viên cần cập nhật khuôn mặt
exports.getlist = async(req, res) => {
    try {
        const pageNumber = req.body.pageNumber || 1;
        const type = req.user.data.type
        // let com_id = req.user.data.com_id
        let com_id = req.body.com_id
        let dep_id = req.body.dep_id
        let idQLC = req.body.user_id
        let findbyNameUser = req.body.findbyNameUser
        let findbyNameDeparment = req.body.findbyNameDeparment
        if(type == 1){
        let condition = {};
        if (com_id) {
            if (com_id) condition.com_id = Number(com_id)
            if (dep_id) condition.dep_id = Number(dep_id)
            if (idQLC) condition.idQLC = Number(idQLC)
            if (findbyNameUser) condition["userName"] = { $regex: findbyNameUser };//tìm kiếm theo tên 
            if (findbyNameDeparment) condition["nameDeparment"] = { $regex: findbyNameDeparment };//tìmm kiếm theo tên phòng ban 
            let data = await Users.aggregate([
                { $lookup: { 
                    from: "QLC_Deparments", 
                    localField: "inForPerson.employee.dep_id", 
                    foreignField: "dep_id", 
                    as: "nameDeparment" }},
                { $project: { 
                    "userName": "$userName", 
                    "dep_id": "$inForPerson.employee.dep_id", 
                    "com_id": "$inForPerson.employee.com_id", 
                    "allow_update_face": "$inForPerson.employee.allow_update_face", 
                    "position_id": "$inForPerson.employee.position_id", 
                    "phoneTK" : "$phoneTK",
                    "avatarUser" : "$avatarUser",
                    "email" : "$email",
                    "idQLC": "$idQLC", 
                    "nameDeparment": "$nameDeparment.dep_name", 
                }},
                {$match: condition},
            ]).skip((pageNumber - 1) * 10).limit(10).sort({ _id: -1 });
            if (data) {
                const avatar = await fnc.createLinkFileEmpQLC(data[0].idQLC , data[0].avatarUser)
                if(avatar) data[0].avatarUser = avatar
                return await functions.success(res, 'Lấy thành công', { data, pageNumber });
            };
            return functions.setError(res, 'Không có dữ liệu');
        }
        return functions.setError(res, "thiếu com_id")
    }
    return functions.setError(res, "Tài khoản không phải Công ty");
    } catch (err) {
        functions.setError(res, err.message)
    }
};
//duyệt 
exports.add = async(req, res) => {
    try {
        let putAllowFace = req.body.putAllowFace// nhập 1 để cho phép cập nhật khuôn mặt 
        let idQLC = req.body.user_id
            let find = await Users.findOne({ idQLC: idQLC, type: 2 }).lean()
            if (find) {
                let data = await Users.updateOne({ idQLC: idQLC, type: 2 }, {
                    $set: {
                        'inForPerson.employee.allow_update_face': putAllowFace,
                    }
                })
                return functions.success(res, "cập nhật thành công ", { data })
            }
            return functions.setError(res, " không tìm thấy nhân viên ")
    } catch (err) {
        functions.setError(res, err.message)
    }
};