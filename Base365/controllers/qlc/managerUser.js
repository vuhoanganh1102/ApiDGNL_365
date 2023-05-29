const managerUser = require("../../models/Users")
const functions = require("../../services/functions")

//tìm danh sách nhân viên của cty 
exports.getListUser= async (req, res) => {
    //Function tìm user là TK nhân viên và TK Cty
    await functions.getDatafind(managerUser, {idQLC: idQLC,type : 2  } )
        //thành công trả models
        .then((manageUser) => functions.success(res, "", manageUser))
        // bắt lỗi 
        .catch((err) => functions.setError(res, err.message, 501));
};
//tìm 1 ứng viên cụ thể 
exports.getUserById = async (req, res) => {
    //tạo biến chứa param id 
    const idQLC = req.params.idQLC;
    // nếu không có param id trả lỗi 
    if (isNaN(idQLC)) {
        functions.setError(res, "IdQLC must be a number", 502);
    } else {
    //nếu tìm được idQLC của nhân viên  
        const UserQLC = await functions.getDatafindOne(managerUser, { idQLC: idQLC , type : 2 });
        if (!UserQLC) {
    //nếu biến idQLc trong usermodul rỗng
            functions.setError(res, "user cannot be found or does not exist", 503);
        } else {
            functions.success(res, "user found", UserQLC);
        }
    }
};

// b1: gửi mã otp tới tên tài khoản được nhập
exports.sendOTP = async(req, res, next) => {
    try {
        const phoneTK = req.body.phoneTK;
        if (await functions.checkPhoneNumber(phoneTK) && await functions.getDatafindOne(managerUser, { phoneTK: phoneTK })) {
            await functions.getDataAxios("http://43.239.223.142:9000/api/users/RegisterMailOtp", { phoneTK })
                .then((response) => {

                    const otp = response.data.otp;
                    if (otp) {
                        return managerUser.updateOne({ phoneTK: phoneTK }, {
                            $set: {
                                otp: otp
                            }
                        });
                    }
                    functions.setError(res, "Gửi OTP lỗi 1", );
                })
                .then(() => {
                    functions.getDatafindOne(managerUser, { phoneTK: phoneTK }, )
                        .then(async(response) => {
                            const token = await functions.createToken(response, '30m'); // tạo token chuyển lên headers
                            res.setHeader('authorization', `Bearer ${token}`);
                            return functions.success(res, 'Gửi OTP thành công');
                        });
                });

        } else {
            return functions.setError(res, "Tài khoản không tồn tại. ", 404)
        }
    } catch (e) {
        return functions.setError(res, "Gửi OTP lỗi3", )
    }

};

// b2: xác nhận mã otp
exports.confirmOTP = async(req, res, next) => {
    try {
        const _id = req.user.data._id;
        const otp = req.body.otp;
        const verify = await managerUser.findOne({ _id: _id, otp }); // tìm user với dk có otp === otp người dùng nhập

        if (verify) {
            const token = await functions.createToken(verify, '30m');
            res.setHeader('authorization', `Bearer ${token}`);
            return functions.success(res, 'Xác thực OTP thành công', );
        } else {
            return functions.setError(res, "Otp không chính xác 1", 404);
        }
    } catch (e) {
        return functions.setError(res, 'Xác nhận OTP lỗi', );
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

            const manager = await functions.getDatafindOne(managerUser, { idQLC: idQLC , type : 2});
            if (!manager) {
                functions.setError(res, "manager does not exist!", 510);
            } else {
                await functions.getDatafindOneAndUpdate(managerUser, { idQLC: idQLC, type : 2 }, {
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
        const manager = await functions.getDatafindOne(managerUser, { idQLC: idQLC, type : 2 });
        if (!manager) {//nếu biến manager không tìm thấy  trả ra fnc lỗi 
            functions.setError(res, "manager not exist!", 510);
        } else {//tồn tại thì xóa 
            functions.getDataDeleteOne(managerUser, { idQLC: idQLC })
                .then(() => functions.success(res, "Delete manager successfully!", manager))
                .catch(err => functions.setError(res, err.message, 512));
        }
    }
};


exports.deleteAllUser = async (req, res) =>{
    if (!await functions.getMaxID(managerUser)) {
        functions.setError( res, "No manager existed",513);
    }else {
        managerUser.deleteMany()
            .then(() => functions.success(res, "Delete all companies successfully"))
            .catch(err => functions.setError(res, err.message,514));
    }
}