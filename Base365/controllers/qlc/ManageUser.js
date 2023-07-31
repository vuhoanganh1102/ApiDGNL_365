const Users = require("../../models/Users");
const functions = require("../../services/functions");
const service = require("../../services/qlc/functions");
const md5 = require('md5');

//tìm danh sách 
exports.getlistAdmin = async(req, res) => {
    try {
        const pageNumber = req.body.pageNumber || 1;
        const type = req.user.data.type;
        let com_id = req.body.com_id;
        let userName = req.body.userName;
        let dep_id = req.body.dep_id;

        if (type == 1) {
            let condition = {
                "inForPerson.employee.ep_status": "Active",
                'inForPerson.employee.com_id': Number(com_id)
            };

            if (com_id) {
                if (userName) condition["userName"] = { $regex: userName }; //tìm kiếm theo tên 
                if (dep_id) condition["inForPerson.employee.dep_id"] = Number(dep_id); //tìmm kiếm theo tên phòng ban 

                let data = await Users.aggregate([
                    { $match: condition },
                    { $sort: { _id: -1 } },
                    { $skip: (pageNumber - 1) * 10 },
                    { $limit: 10 },
                    {
                        $lookup: {
                            from: "QLC_Deparments",
                            localField: "inForPerson.employee.dep_id",
                            foreignField: "dep_id",
                            as: "deparment"
                        }
                    },
                    {
                        $project: {
                            userName: "$userName",
                            dep_id: "$inForPerson.employee.dep_id",
                            com_id: "$inForPerson.employee.com_id",
                            position_id: "$inForPerson.employee.position_id",
                            phoneTK: "$phoneTK",
                            email: "$email",
                            emailContact: "$emailContact",
                            idQLC: "$idQLC",
                            nameDeparment: "$deparment.dep_name",
                            gender: "$inForPerson.employee.gender",
                            married: "$inForPerson.employee.married",
                            address: "$address",
                            position_id: "$inForPerson.employee.position_id",
                            ep_status:"$inForPerson.employee.ep_status",
                            avatarUser:"$avatarUser"
                        }
                    },
                ]);
                const count = await Users.countDocuments(condition);
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    element.nameDeparment = element.nameDeparment.toString()
                }
                return await functions.success(res, 'Lấy thành công', { data, count });
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
    try {
        const type = req.user.data.type,
            com_id = req.body.com_id;
        const { userName, phoneTK, emailContact, password, role, address, birthday, dep_id, group_id, team_id, position_id, gender, education, married, experience, start_working_time } = req.body;
        if (type == 1) {
            if (com_id && userName && password && role && address && position_id && gender) {
                //Kiểm tra tên nhân viên khác null

                const manager = await functions.getDatafindOne(Users, { phoneTK: phoneTK, type: { $ne: 1 } });
                if (!manager) {
                    //Lấy ID kế tiếp, nếu chưa có giá trị nào thì bằng 0 có giá trị max thì bằng max + 1 
                    let maxID = await functions.getMaxUserID();
                    const ManagerUser = new Users({
                        _id: maxID._id,
                        idQLC: maxID._idQLC,
                        idTimViec365: maxID._idTV365,
                        idRaoNhanh365: maxID._idRN365,
                        "inForPerson.employee.com_id": com_id,
                        userName: userName,
                        phoneTK: phoneTK,
                        emailContact: emailContact,
                        password: md5(password),
                        address: address,
                        role: role,
                        "inForPerson.account.gender": gender,
                        "inForPerson.account.birthday": Date.parse(birthday) / 1000,
                        "inForPerson.account.education": education,
                        "inForPerson.account.married": married,
                        "inForPerson.account.experience": experience,
                        "inForPerson.employee.start_working_time": Date.parse(start_working_time) / 1000,
                        "inForPerson.employee.dep_id": dep_id,
                        "inForPerson.employee.position_id": position_id,
                        "inForPerson.employee.group_id": group_id,
                        "inForPerson.employee.team_id": team_id,
                        "inForPerson.employee.ep_status": "Active",
                        "fromWeb": "quanlychung",
                        type: 2,
                        createdAt: functions.getTimeNow(),
                        chat365_secret: functions.chat365_secret(maxID._id)
                    });

                    await ManagerUser.save()
                    return functions.success(res, "user created successfully");
                }
                return functions.setError(res, "Tài khoản đã tồn tại!");
            }
            return functions.setError(res, "Cần nhập đủ thông tin");
        }
        return functions.setError(res, "Tài khoản không phải Công ty");
    } catch (e) {
        return functions.setError(res, e.message);

    }
};

// chỉnh sửa
exports.editUser = async(req, res) => {
    try {
        const type = req.user.data.type,
            com_id = req.body.com_id;

        const { userName, phoneTK, emailContact, password, role, address, birthday, dep_id, group_id, team_id, position_id, gender, education, married, experience, start_working_time, _id } = req.body;
        if (type == 1) {
            if (com_id && userName && password && role && address && position_id && gender) {
                //Kiểm tra tên nhân viên khác null
                const manager = await Users.findOne({ _id });
                if (manager) {
                    let data = {
                        "inForPerson.employee.com_id": com_id,
                        userName: userName,
                        emailContact: emailContact,
                        address: address,
                        role: role,
                        "inForPerson.account.gender": gender,
                        "inForPerson.account.birthday": Date.parse(birthday) / 1000,
                        "inForPerson.account.education": education,
                        "inForPerson.account.married": married,
                        "inForPerson.account.experience": experience,
                        "inForPerson.employee.start_working_time": Date.parse(start_working_time) / 1000,
                        "inForPerson.employee.dep_id": dep_id,
                        "inForPerson.employee.position_id": position_id,
                        "inForPerson.employee.group_id": group_id,
                        "inForPerson.employee.team_id": team_id,
                        "inForPerson.employee.ep_status": "Active",
                    };

                    if (password) {
                        data.password = md5(password);
                    }
                    await functions.getDatafindOneAndUpdate(Users, { _id }, data)
                    return functions.success(res, "Sửa thành công", { manager })
                }
                return functions.setError(res, "người dùng không tồn tại");
            }
            return functions.setError(res, "thiếu thông tin");
        }
        return functions.setError(res, "Tài khoản không phải Công ty");
    } catch (e) {
        return functions.setError(res, e.message);

    }
}

//xoa nhan vien
exports.deleteUser = async(req, res) => {
    try {
        //tạo biến đọc idQLC
        const type = req.user.data.type
        let com_id = req.user.data.com_id
            // let com_id = req.body.com_id
        const idQLC = req.body.idQLC;
        if (type == 1) {
            const manager = await functions.getDatafindOne(Users, { "inForPerson.employee.com_id": com_id, idQLC: idQLC, type: 2 });
            if (manager) { //nếu biến manager không tìm thấy  trả ra fnc lỗi 
                functions.getDataDeleteOne(manageUser, { idQLC: idQLC })
                return functions.success(res, "xóa thành công!", { manager })
            }
            return functions.setError(res, "người dùng không tồn tại!", 510);
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);
    } catch (e) {
        return functions.setError(res, e.message);

    }
};

exports.listAll = async(req, res) => {
    try {
        const com_id = req.user.data.com_id;
        let data = await Users.aggregate([{
                $match: {
                    "inForPerson.employee.ep_status": "Active",
                    "inForPerson.employee.com_id": com_id,
                }
            },
            { $sort: { userName: -1 } },
            {
                $lookup: {
                    from: "QLC_Deparments",
                    localField: "inForPerson.employee.dep_id",
                    foreignField: "dep_id",
                    as: "deparment"
                }
            },
            {
                $project: {
                    userName: "$userName",
                    idQLC: "$idQLC",
                    nameDeparment: "$deparment.dep_name",
                    dep_id: "$deparment.dep_id",
                    position_id: "$inForPerson.employee.position_id",
                    avatarUser: "$avatarUser"
                }
            },
        ]);
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            element.nameDeparment = element.nameDeparment.toString();
            element.avatarUser = service.createLinkFileEmpQLC(element.idQLC, element.avatarUser);
        }
        return await functions.success(res, 'Lấy thành công', { data });
    } catch (error) {
        console.log(err);
        functions.setError(res, err.message)
    }
}