const manageUser = require("../../models/Users")
const functions = require("../../services/functions")

//tìm danh sách nhân viên của cty 
exports.getListUser= async (req, res) => {
    try {
        let page = Number(req.body.page);
        let pageSize = Number(req.body.pageSize);
        if (page && pageSize) {
            let user = await functions.getDatafind(manageUser, {idQLC: idQLC,type : 2  } );
            if (user) {
                const skip = (page - 1) * pageSize;
                const limit = pageSize;
                const blogs = await functions.pageFind(Blog, { adminId: adminId }, { _id: -1 }, skip, limit);
                const totalCount = await functions.findCount(Blog, { adminId: adminId });
                console.log(totalCount)
                const totalPages = Math.ceil(totalCount / pageSize);
                return functions.success(res, "Lấy danh sách blog thành công", { admin: admin, totalCount: totalCount, totalPages: totalPages, blogs: blogs });
            }
            return functions.setError(res, 'không tồn tại', 404)
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

//     //Function tìm user là TK nhân viên và TK Cty
//     await functions.getDatafind(manageUser, {idQLC: idQLC,type : 2  } )
//         //thành công trả models
//         .then((manageUser) => functions.success(res, "", manageUser))
//         // bắt lỗi 
//         .catch((err) => functions.setError(res, err.message, 501));
// };
//tìm 1 ứng viên cụ thể 
exports.getUserById = async (req, res) => {
    //tạo biến chứa param id 
    const idQLC = req.params.idQLC;
    // nếu không có param id trả lỗi 
    if (isNaN(idQLC)) {
        functions.setError(res, "IdQLC must be a number", 502);
    } else {
    //nếu tìm được idQLC của nhân viên  
        const UserQLC = await functions.getDatafindOne(manageUser, { idQLC: idQLC , type : 2 });
        if (!UserQLC) {
    //nếu biến idQLc trong usermodul rỗng
            functions.setError(res, "user cannot be found or does not exist", 503);
        } else {
            functions.success(res, "user found", UserQLC);
        }
    }
};
//tạo nhân viên 
exports.createUser = async (req, res) => {

    const { userName, email , phoneTK } = req.body;

    if (!userName) {
        //Kiểm tra tên nhân viên khác null
        functions.setError(res, "user name required", 506);

    } else if (!email) {
        //Kiểm tra email khác null
        functions.setError(res, "email required", 506);

    } else if (!phoneTK) {
        //Kiểm tra sdt khác null
        functions.setError(res, "number phone required", 507);

    } else if (typeof phoneTK !== "number") {
        //Kiểm tra sdt có phải là số không
        functions.setError(res, "number phone must be a number", 508);

    } else {
        //Lấy ID kế tiếp, nếu chưa có giá trị nào thì bằng 0 có giá trị max thì bằng max + 1 
        let maxID = await functions.getMaxID(idQLC);
        if (!maxID) {
            maxID = 0
        };
        const idQLC = Number(maxID) + 1;
        const ManagerUser = new manageUser({
            idQLC : idQLC,
            companyID : companyID,
            userName : userName,
            email : email,
            phoneTK :  phoneTK,
            password : password,
            companyEmail : companyEmail,
            gender : gender,
            birthday : birthday,
            address : address,
            positionID : positionID,
            type : type,
            depID : depID,
            groupID : groupID,
        });

        await ManagerUser.save()
            .then(() => {
                functions.success(res, "user created successfully", ManagerUser)
            })
            .catch((err) => {
                functions.setError(res, err.message, 509);
            })
    }
};

// chỉnh sửa
exports.editUser = async (req, res) => {
    const idQLC = req.params.idQLC;

    if (isNaN(idQLC)) {
        functions.setError(res, "id must be a number", 502)
    } else {
        const { userName, email , phoneTK } = req.body;

        if (!userName) {
            //Kiểm tra tên nhân viên khác null
            functions.setError(res, "user name required", 506);
    
        } else if (!email) {
            //Kiểm tra email khác null
            functions.setError(res, "email required", 506);
    
        } else if (!phoneTK) {
            //Kiểm tra sdt khác null
            functions.setError(res, "number phone required", 507);
    
        } else if (typeof phoneTK !== "number") {
            //Kiểm tra sdt có phải là số không
            functions.setError(res, "number phone must be a number", 508);
    

        } else {

            const manager = await functions.getDatafindOne(manageUser, { idQLC: idQLC , type : 2});
            if (!manager) {
                functions.setError(res, "manager does not exist!", 510);
            } else {
                await functions.getDatafindOneAndUpdate(manageUser, { idQLC: idQLC, type : 2 }, {
                    userName : userName,
                    email : email,
                    phoneTK : phoneTK,
                    depID : depID,
                    positionID : positionID,


                })
                    .then((manager) => functions.success(res, "Deparment edited successfully", manager))
                    .catch((err) => functions.setError(res, err.message, 511));
            }
        }
    }
};

exports.deleteUser = async (req, res) => {
    //tạo biến đọc idQLC
    const idQLC = req.params.idQLC;
    //nếu idQLC không phải số
    if (iasNN(idQLC)) {
        functions.setError(res, "Id must be a number", 502);
    } else {// thì tìm trong 1 idQLC trong user model 
        const manager = await functions.getDatafindOne(manageUser, { idQLC: idQLC, type : 2 });
        if (!manager) {//nếu biến manager không tìm thấy  trả ra fnc lỗi 
            functions.setError(res, "manager not exist!", 510);
        } else {//tồn tại thì xóa 
            functions.getDataDeleteOne(manageUser, { idQLC: idQLC })
                .then(() => functions.success(res, "Delete manager successfully!", manager))
                .catch(err => functions.setError(res, err.message, 512));
        }
    }
};


exports.deleteAllUser = async (req, res) =>{
    if (!await functions.getMaxID(manageUser)) {
        functions.setError( res, "No manager existed",513);
    }else {
        manageUser.deleteMany()
            .then(() => functions.success(res, "Delete all companies successfully"))
            .catch(err => functions.setError(res, err.message,514));
    }
}