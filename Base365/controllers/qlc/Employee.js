const Users = require('../../models/Users')
const functions = require('../../services/functions')

//đăng kí tài khoản nhân viên 
exports.createEmpAcc = async (req,res)=>{
    const { userName, email , phoneTK, password, companyId, address } = req.body;

        if ((userName && password && companyId &&
            address && email && phoneTK) !== undefined) {
                // validate email,phone
            let CheckEmail = await functions.checkEmail(email),
            CheckPhoneNumber = await functions.checkPhoneNumber(phoneTK);
            if ((CheckPhoneNumber && CheckEmail) == true) {
                //  check email co trong trong database hay khong
                let user = await functions.getDatafindOne(Users, { email: email , type : 2})
                if (user == null) {//nếu không tìm thấy user thì tạo mới tài khoản
                    let maxID = await fnc.getMaxID(Users);

                    var timeCreate = req.body.use_create_time != 0 ? new Date(req.body.use_create_time * 1000) : null,
                        timeUpdate = req.body.use_update_time != 0 ? new Date(req.body.use_update_time * 1000) : null;
                    // tìm Id max trong DB
                    var newMaxID = Number(maxID) + 1;
                    const checkUserByID = await fnc.getDatafindOne(Users, { _id: newMaxID });
                    if (checkUserByID == null) {
                        const user = await new Users({
                            _id: newMaxID,
                            email,
                            phoneTK,
                            userName: req.body.userName,
                            alias: slug(req.body.alias),
                            phone: req.body.phone,
                            avatarUser: req.body.avatarUser,
                            type: 2,
                            password: req.body.password,
                            address: req.body.use_address,
                            otp: req.body.otp,
                            authentic: req.body.authentic,
                            fromWeb: "quanlichung.timviec365",
                            from: req.body.dk,
                            createdAt: timeCreate,
                            updatedAt: timeUpdate,
                            role: 0,
                            latitude: req.body.latitude,
                            longtitude: req.body.longtitude,
                            idQLC: req.body.idQLC,
                    })
                    await user.save().then(() => {
                        console.log("Thêm mới thành công ID Công ty: " + email + "," + phoneTK);
                    }).catch((e) => {
                        console.log(e);
                    });
                } else { //nếu thấy user tồn tại trả ra lôi
                    await functions.setError(res, 'email đã tồn tại', 404);
                }    
            }
        }
    }
}

