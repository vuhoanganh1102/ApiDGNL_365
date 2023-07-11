const Deparment = require("../../models/qlc/Deparment")
const functions = require("../../services/functions")
const Users = require("../../models/Users")


//API lấy tất cả dữ liệu phòng ban 
exports.getListDeparment = async(req, res) => {
    try {
        let com_id = req.body.com_id
        let dep_id = req.body.dep_id
            // let dep_id = req.body.dep_id

        let condition = {};
        let data = []
        let total_emp = {}
        let totalDepartment = {}

        if ((com_id) == undefined) {
            functions.setError(res, "lack of input")
        } else if (isNaN(com_id)) {
            functions.setError(res, "id must be a Number")
        } else {
            if (com_id) condition.com_id = com_id
            if (dep_id) condition.dep_id = dep_id



            const data = await Deparment.find(condition);
            // const depID = data.map(item => item._id);
            // for (let i = 0; i < depID.length; i++) {
            //     const depId = depID[i];
            //     total_emp = await functions.findCount(Users, { "inForPerson.employee.com_id": com_id, "inForPerson.employee.dep_id": depId, type: 2, "inForPerson.employee.ep_status": "Active" })

            //     await Deparment.findOneAndUpdate({ com_id: com_id, _id: depId }, { $set: { total_emp: total_emp } });
            // }
            // if (!data) {
            //     return functions.setError(res, 'Không có dữ liệu', 404);
            // };
            return functions.success(res, 'Lấy thành công', { data });
        }

    } catch (err) {

        return functions.setError(res, err.message)
    }
};

//API đếm số lượng nhân viên phòng ban 
exports.countUserInDepartment = async(req, res) => {
    try {
        const { dep_id, com_id } = req.body;
        const total_emp = await functions.findCount(Users, { "inForPerson.employee.com_id": com_id, "inForPerson.employee.dep_id": dep_id, type: 2 })
            // .then(() => functions.success(res, "",{numberUser}))
            // .catch((err) => functions.setError(res, err.message, 501));
        if (!numberUser) {
            return functions.setError(res, "Deparment cannot be found or does not exist", 503);
        } else {
            return functions.success(res, "Deparment found", { numberUser });
        }
    } catch (e) {
        return functions.setError(res, "Deparment does not exist", 503);
    }
}

//API tạo mới một phòng ban
exports.createDeparment = async(req, res) => {
    try {
        // const com_id = req.user.data.com_id
        const com_id = req.body.com_id

        const { deparmentName, managerId, deputyId, deparmentOrder, deparmentCreated, total_emp } = req.body;
        if (com_id && deparmentName) {
            //Kiểm tra Id công ty khác null

                        //Lấy ID kế tiếp, nếu chưa có giá trị nào thì bằng 1
                        let maxID = await Deparment.findOne({},{},{sort:{dep_id:-1}}).lean() || 0 ;
                        console.log(maxID)
                        const deparments = new Deparment({
                            dep_id: Number(maxID.dep_id) + 1 || 1,
                            com_id: com_id,
                            deparmentName: deparmentName,
                            managerId: managerId || null,
                            deputyId: deputyId || null,
                            deparmentCreated: new Date(),
                            deparmentOrder: deparmentOrder || 0,
                            total_emp: total_emp,
                        });
            
                        await deparments.save()
            return functions.success(res, "Tạo thành công", {deparments});
                            
            
        }
            return functions.setError(res, "nhập thiếu thông tin", 504);
            
        
    } catch (error) {
        return functions.setError(res, error.message)

    }
};
//API thay dổi thông tin của một phòng ban
exports.editDeparment = async(req, res) => {
    try {
        const _id = req.body.id;

        if (isNaN(_id)) {
            functions.setError(res, "Id must be a number", 502)
        } else {
            const { com_id, deparmentName, managerId, deputyId } = req.body;

            if (!com_id) {
                //Kiểm tra Id công ty khác null
                functions.setError(res, "Company ID required", 504);

            } else if (isNaN(com_id)) {
                //Kiểm tra Id công ty có phải số không
                functions.setError(res, "Company ID must be a number", 505);
            } else {
                const deparment = await functions.getDatafindOne(Deparment, { _id: _id });
                if (!deparment) {
                    functions.setError(res, "Deparment does not exist!", 510);
                } else {
                    await functions.getDatafindOneAndUpdate(Deparment, { com_id: com_id, _id: _id }, {
                            com_id: com_id,
                            deparmentName: deparmentName,
                            managerId: managerId || null,
                            deputyId: deputyId || null,
                        })
                        .then((deparment) => functions.success(res, "Deparment edited successfully", { deparment }))
                        .catch((err) => functions.setError(res, err.message, 511));
                }
            }
        }
    } catch (error) {
        return functions.setError(res, error.message)

    }
};
//API xóa một phòng ban theo id
exports.deleteDeparment = async(req, res) => {
    try {
        const _id = req.body.id;
        const com_id = req.body.com_id;
        if ((com_id && _id) == undefined) {
            functions.setError(res, "lack of input", 502);
        } else if (isNaN(_id, com_id)) {
            functions.setError(res, "Id must be a number", 502);
        } else {
            await Users.updateOne({ "inForPerson.employee.com_id": com_id, "inForPerson.employee.dep_id": _id }, { $set: { "inForPerson.employee.dep_id": 0 } })
            const deparment = await functions.getDatafindOne(Deparment, { com_id: com_id, _id: _id });
            if (!deparment) {
                functions.setError(res, "Deparment not exist!", 510);
            } else {
                functions.getDataDeleteOne(Deparment, { com_id: com_id, _id: _id })
                    .then((deparment) => functions.success(res, "Delete deparment successfully!", { deparment }))
                    .catch(err => functions.setError(res, err.message, 512));
            }
        }
    } catch (error) {
        return functions.setError(res, error.message)
    }
};