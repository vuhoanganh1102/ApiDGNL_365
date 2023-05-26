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

//tạo nhân viên 
exports.createEmployee = async (req, res) => {

    const companyID = req.body.companyID;
    const type = 2;
    const phoneTK = req.body.phoneTK;
    const userName = req.body.userName;
    const password = req.body.password;
    const phone = req.body.phone;
    const address = req.body.address;
    const gender = req.body.gender;
    const birthday = req.body.birthday;
    const candiHocVan = req.body.candiHocVan;
    const married = req.body.married;
    const exp = req.body.exp;
    const positionID = req.body.positionID;
    const depID = req.body.depID;
    const groupID = req.body.groupID;

    
    if (!companyID) {
        //Kiểm tra id company khác null
        functions.setError(res, "companyID required", 504);

    } else if (!userName) {
       
         //Kiểm tra tên nhân viên khác null
        functions.setError(res, "user name required", 506);

    } else if (!phoneTK) {
        //Kiểm tra sdt khác null
        functions.setError(res, "number phone required", 507);

    } else if (!await functions.checkPhoneNumber(phoneTK)) {
        //Kiểm tra sdt dan ky tk có phải là số không
        functions.setError(res, "number phone invalid", 508);

    }else if (!password) {
        //Kiểm tra password khác null
        functions.setError(res, "password required", 509);

    }else if (!address) {
        //Kiểm tra address khác null
        functions.setError(res, "address required", 507);

    } else if (!birthday) {
        //Kiểm tra ngay sinh khác null
        functions.setError(res, "birthday required", 507);

    }else if (!exp) {
        //Kiểm tra kinh nghiem lam viec khác null
        functions.setError(res, "exp required", 507);

    }else if (!candiHocVan) {
        //Kiểm tra trinh do hoc van khác null
        functions.setError(res, "candiHocVan required", 507);

    }
    else {
        let checkPhoneNumber = await functions.checkPhoneNumber(phoneTK);
        if(checkPhoneNumber) {
            let checkUser = await functions.getDatafindOne(managerUser, { phoneTK:phoneTK, type: 2 });
            if(checkUser) {
                return functions.setError(res, "Số điện thoại đã được đăng kí", 200);
            }
        }
        //Lấy ID kế tiếp, nếu chưa có giá trị nào thì bằng 0 có giá trị max thì bằng max + 1 
        let maxID = await functions.getMaxIDQLC(managerUser);
        if (!maxID) {
            maxID = 0
        };
        let idQLC = Number(maxID) + 1;
        const maxIDUser = await managerUser.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
        let newIDUser;
        if (maxIDUser) {
            newIDUser = Number(maxIDUser._id) + 1;
        } else newIDUser = 1;
        const Employee = new managerUser({
            _id: newIDUser,
            idQLC : idQLC,
            userName : userName,
            phoneTK :  phoneTK,
            password : password,
            phone: phone? phone: null,
            address : address,
            type : type,
            inForPerson: {
                companyID: companyID,
                gender: gender,
                birthday: birthday,
                candiHocVan: candiHocVan,
                married: married,
                exp: exp,
                positionID: positionID,
                depID: depID,
                groupID: groupID
            },
            // 'inForPerson.groupID' : groupID,
        });

        await Employee.save()
            .then(() => {
                functions.success(res, "user created successfully", Employee)
            })
            .catch((err) => {
                functions.setError(res, err.message, 509);
            })
    }
};

exports.createIndividual = async (req, res) => {
  
    const type = 0;
    const phoneTK = req.body.phoneTK;
    const userName = req.body.userName;
    const password = req.body.password;
    const phone = req.body.phone;
    const address = req.body.address;

    let checkPhoneNumber = await functions.checkPhoneNumber(phoneTK);
    if(checkPhoneNumber) {
        let checkUser = await functions.getDatafindOne(managerUser, { phoneTK:phoneTK, type: type });
        if(checkUser) {
            return functions.setError(res, "Số điện thoại đã được đăng kí", 200);
        }
    }
    if (!userName) {
        //Kiểm tra tên nhân viên khác null
        functions.setError(res, "user name required", 506);

    } else if (!phoneTK) {
        //Kiểm tra sdt khác null
        functions.setError(res, "number phone required", 507);

    }else if (!password) {
        //Kiểm tra password khác null
        functions.setError(res, "password required", 507);

    }else if (!address) {
        //Kiểm tra address khác null
        functions.setError(res, "address required", 507);

    }
    else {
        //Lấy ID kế tiếp, nếu chưa có giá trị nào thì bằng 0 có giá trị max thì bằng max + 1 
        let maxID = await functions.getMaxIDQLC(managerUser);
        if (!maxID) {
            maxID = 0
        };
        let idQLC = Number(maxID) + 1;
        const maxIDUser = await managerUser.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
        let newIDUser;
        if (maxIDUser) {
            newIDUser = Number(maxIDUser._id) + 1;
        } else newIDUser = 1;
        const Individual = new managerUser({
            _id: newIDUser,
            idQLC : idQLC,
            userName : userName,
            phoneTK :  phoneTK,
            password : password,
            phone: phone? phone: null,
            address : address,
            type : type
        });

        await Individual.save()
            .then(() => {
                functions.success(res, "user created successfully", Individual)
            })
            .catch((err) => {
                functions.setError(res, err.message, 509);
            })
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
//chinh sua thong tin nhan vien
exports.editEmployee = async (req, res) => {
    console.log(req.body);
    const idQLC = req.body.idQLC;
    const companyID = req.body.companyID;
    const type = 2;
    const userName = req.body.userName;
    const emailContact = req.body.emailContact;
    const phone = req.body.phone;
    const address = req.body.address;
    const gender = req.body.gender;
    const birthday = req.body.birthday;
    const candiHocVan = req.body.candiHocVan;
    const married = req.body.married;
    const exp = req.body.exp;
    const startWorkingTime = req.body.startWorkingTime;
    const positionID = req.body.positionID;
    const depID = req.body.depID;
    const groupID = req.body.groupID;

    
    if (!userName) {
        //Kiểm tra tên nhân viên khác null
        functions.setError(res, "user name required", 506);

    } else if (!idQLC) {
        //Kiểm tra idQLC khác null
        functions.setError(res, "idQLC required", 507);

    } else if (!companyID) {
        //Kiểm tra id company khác null
        functions.setError(res, "email required", 508);

    } else if (!emailContact) {
        //Kiểm tra sdt khác null
        functions.setError(res, "number phone required", 509);

    } else if (!await functions.checkEmail(emailContact)) {
        //Kiểm tra sdt dan ky tk có phải là số không
        functions.setError(res, "Email invalided", 510);

    }else if (!married) {
        //Kiểm tra password khác null
        functions.setError(res, "married required", 511);

    }else if (!address) {
        //Kiểm tra address khác null
        functions.setError(res, "address required", 512);

    } else if (!birthday) {
        //Kiểm tra ngay sinh khác null
        functions.setError(res, "birthday required", 513);

    }else if (!exp) {
        //Kiểm tra kinh nghiem lam viec khác null
        functions.setError(res, "exp required", 514);

    }else if (!candiHocVan) {
        //Kiểm tra trinh do hoc van khác null
        functions.setError(res, "candiHocVan required", 515);

    } else {
        const employee = await functions.getDatafindOne(managerUser, { idQLC: idQLC , type : 2});
        if (!employee) {
            functions.setError(res, "employee does not exist!", 510);
        } else {
            await functions.getDatafindOneAndUpdate(managerUser, { idQLC: idQLC, type : 2 }, {
                userName : userName,
                emailContact: emailContact,
                phone: phone,
                address: address,
                inForPerson: {
                    gender: gender,
                    birthday: birthday,
                    candiHocVan: candiHocVan,
                    married: married,
                    exp: exp,
                    startWorkingTime: startWorkingTime,
                    positionID: positionID,
                    depID: depID,
                    groupID: groupID
                }
            })

                .then((manager) => functions.success(res, "Deparment edited successfully", manager))
                .catch((err) => functions.setError(res, err.message, 511));
        }
    }
};

//chinh sua thong tin ca nhan
exports.editIndividual = async (req, res) => {
    const idQLC = req.body.idQLC;
    const type = 0;
    const userName = req.body.userName;
    const emailContact = req.body.emailContact;
    const phone = req.body.phone;
    const address = req.body.address;
    const gender = req.body.gender;
    const birthday = req.body.birthday;
    const candiHocVan = req.body.candiHocVan;
    const married = req.body.married;
    const exp = req.body.exp;

    if(!idQLC){
        functions.setError(res, "idQLC required", 501);
    } else if (!userName) {
        //Kiểm tra tên nhân viên khác null
        functions.setError(res, "user name required", 506);

    } else if (!phone) {
        //Kiểm tra phone khác null
        functions.setError(res, "phone required", 507);

    } else if (!emailContact) {
        //Kiểm tra sdt khác null
        functions.setError(res, "email required", 508);

    } else if (!await functions.checkEmail(emailContact)) {
        //Kiểm tra sdt dan ky tk có phải là số không
        functions.setError(res, "Email invalid", 509);

    }else if (!address) {
        //Kiểm tra address khác null
        functions.setError(res, "address required", 510);

    } else if (!gender) {
        //Kiểm tra gender khác null
        functions.setError(res, "gender required", 510);

    } else if (!birthday) {
        //Kiểm tra ngay sinh khác null
        functions.setError(res, "birthday required", 511);

    }else if (!exp) {
        //Kiểm tra kinh nghiem lam viec khác null
        functions.setError(res, "exp required", 512);

    }else if (!candiHocVan) {
        //Kiểm tra trinh do hoc van khác null
        functions.setError(res, "candiHocVan required", 513);

    } else {
        const individual = await functions.getDatafindOne(managerUser, { idQLC: idQLC , type : 0});
        if (!individual) {
            functions.setError(res, "individual does not exist!", 510);
        } else {
            await functions.getDatafindOneAndUpdate(managerUser, { idQLC: idQLC, type : 0 }, {
                userName : userName,
                emailContact: emailContact,
                phone: phone,
                address: address,
                inForPerson: {
                    gender: gender,
                    birthday: birthday,
                    candiHocVan: candiHocVan,
                    married: married,
                    exp: exp,
                }
            })

                .then((manager) => functions.success(res, "Individual edited successfully", manager))
                .catch((err) => functions.setError(res, err.message, 511));
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