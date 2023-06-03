const Users = require("../../models/Users")
const functions = require("../../services/functions")
const md5 = require("md5")

//đăng kí tài khoản cá nhân 
exports.register = async (req, res) => {
    const { userName, email, password, phoneTK, address } = req.body

    if (userName && email && password && phoneTK  && address) {

        let User = await functions.getDatafindOne(Users, { email, phoneTK, type: 0 });

        let MaxId = await functions.getMaxID(Users) || 0
        if (User == null) {
                const Inuser = new Users({
                _id: Number(MaxId) + 1||1 ,
                email: req.body.email,
                userName: req.body.userName,
                phoneTK: req.body.phoneTK,
                password: md5(password),
                address: req.body.address,
                type: 0,
                role: 0,
                otp: null,
                authentic: null,
                idQLC: (Number(MaxId) + 1),
                "inForPerson.companyID": req.body.companyID,
                "inForPerson.depID": req.body.depID,
            })
                await Inuser.save().then(() => {
                    console.log(`hêm mới tài khoản cá nhân thành công ${email} , ${phoneTK}`)
                }).catch((e) => {
                    console.log(e);

                });
        } else {
            await functions.setError(res, " email đã tồn tại")
        }
    } else {
        functions.setError(res, "thiếu thông tin để đăng kí ")
    }
}

// hàm xác thực otp bước 1: gửi OTP qua phone khi kích hoạt tài khoản
exports.sendOTP = async (req, res) => {
    try {
        let phoneTK = req.user.data.phoneTK;
        //api gửi otp cho user qua sđt
        let send = await functions.getDataAxios('http:/api/users/RegisterPhoneOtp', { phoneTK });
        let otp = send.data.otp
        if (otp) {
            await Users.updateOne({ phoneTK: phoneTK }, {
                $set: {
                    otp: otp
                }
            });
            const token = await functions.createToken(verify, '30m')
            return functions.success(res, 'xác thực thành công', { token })
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, error)
    }
}
//hàm xác thực otp bước 2: người dùng điền otp để xác thưc tài khoản
exports.verify = async (req, res) => {
    let otp = req.body.ma_xt,
        phoneTK = req.user.data.phoneTK
    if (otp && phoneTK) {
        let data = await functions.getDatafindOne(Users, { phoneTK, otp, type: 0 })
        if (data != null) {
            await Users.updateOne({ phoneTK }, {
                $set: {
                    authentic: 1
                }
            })
            return functions.success(res, "xác thực thành công")
        } else {
            return functions.setError(res, "sai ma xac thuc")
        }
    } else {
        return functions.setError(res, "thieu thong tin")
    }
}
exports.login = async (req, res) => {

    try {
        let email = req.body.email
            password = req.body.password
            type = 0
        if (email && password) {
            let checkMail = await functions.checkEmail(email)
            if (checkMail) {
                let findUser = await functions.getDatafindOne(Users, { email, type: 0 })
                if (!findUser) {
                    return functions.setError(res, "không tìm thấy tài khoản trong bảng user", 404)
                }
                let checkPassword = await functions.verifyPassword(password, findUser.password)
                if (!checkPassword) {
                    return functions.setError(res, "Mật khẩu sai", 404)
                }
                if (findUser != null) {
                    const token = await functions.createToken(findUser, "1d")
                    const refreshToken = await functions.createToken({ userId: findUser._id }, "1y")
                    let data = {
                        access_token: token,
                        refresh_token: refreshToken,
                        user_info: {
                            user_id: findUser._id,
                            user_email: findUser.email,
                            user_phoneTK: findUser.phoneTK,
                            user_password: findUser.password,
                            user_name: findUser.userName,
                            user_address: findUser.address,
                            user_authentic: findUser.authentic,
                            user_avatar: findUser.avatarUser,
                            user_companyID: findUser.companyID,
                            user_depID: findUser.depID,
                            user_groupID: findUser.groupID,
                            user_birthday: findUser.birthday,
                            user_gender: findUser.gender,
                            user_married: findUser.married,
                            user_exp: findUser.exp,
                            user_startWorkingTime: findUser.startWorkingTime,
                            user_candiHocVan: findUser.candiHocVan,

                        }

                    }
                    return functions.success(res, "dang nhap thanh cong", data)
                } else {
                    await functions.setError(res, "mail khong ton tai ")
                }
            } else {
                await functions.setError(res, "thieu email hoac password")
            }
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, error)
    }
}

// hàm đổi mật khẩu 
exports.updatePassword = async (req, res, next) => {
    try {
        let idQLC = req.user.body.idQLC;
        let password = req.body.password;
        if (password) {
            let checkPass = await functions.getDatafindOne(Users, { idQLC, password: md5(password), type: 0 })
            if (!checkPass) {
                await Users.updateOne({ idQLC: idQLC }, {
                    $set: {
                        password: md5(password),
                    }
                });
                return functions.success(res, 'cập nhập thành công')
            }
            return functions.setError(res, 'mật khẩu đã tồn tại, xin nhập mật khẩu khác ', 404)
        }
        return functions.setError(res, 'vui lòng nhập mật khẩu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm cập nhập thông tin cá nhân
exports.updateInfoindividual = async(req, res, next) => {
    try {
        let email = req.user.data.email
        let request = req.body,
            phone = request.phone,
            companyID = request.companyID,
            userName = request.userName,
            address = request.address,
            avatarUser = request.avatarUser,
            depID = request.depID,
            birthday = request.birthday
            gender = request.gender
            married = request.married
            exp = request.exp
            startWorkingTime = request.startWorkingTime
            candiHocVan = request.candiHocVan
            positionID = request.positionID
            groupID = request.groupID


        if (phone || userName || email ||positionID || candiHocVan || avatarUser || address||avatarUser||depID||birthday||gender||married||exp) {
            let checkPhone = await functions.checkPhoneNumber(phone)
            if (checkPhone) {
                await Users.updateOne({ email: email, type: 0 }, {
                    $set: {
                        'userName': userName,
                        'phone': phone,
                        'email': email,
                        'address': address,
                        'companyID':companyID || null,
                        'avatarUser': avatarUser || null,
                        'department': depID || null,
                        'group' : groupID || null,
                        'birthday': birthday,
                        'gender': gender,
                        'married': married,
                        'exp': exp,
                        'startWorkingTime': startWorkingTime,
                        'candiHocVan': candiHocVan,
                        'positionID': positionID,
                    }
                });
                return functions.success(res, 'update thành công', 404)
            }
            return functions.setError(res, 'sai định dạng số điện thoại', 404)
        }
        return functions.setError(res, 'không có dữ liệu cần cập nhật', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm cập nhập avatar
exports.updateImg = async(req, res, next) => {
    try {
        let email = req.user.data.email,
            avatarUser = req.file;
        if (avatarUser) {
            let checkImg = await functions.checkImage(avatarUser.path)
            if (checkImg) {
                await Users.updateOne({ email: email, type: 2 }, {
                    $set: {
                        avatarUser: avatarUser.filename,
                    }
                });
                return functions.success(res, 'thay đổi ảnh thành công')
            } else {
                await functions.deleteImg(avatarUser)
                return functions.setError(res, 'sai định dạng ảnh hoặc ảnh lớn hơn 2MB', 404)
            }
        } else {
            await functions.deleteImg(avatarUser)
            return functions.setError(res, 'chưa có ảnh', 404)
        }
    } catch (error) {
        console.log(error)
        await functions.deleteImg(req.file)
        return functions.setError(res, error)
    }
}

// hàm bước 1 của quên mật khẩu
exports.forgotPasswordCheckMail = async (req, res, next) => {
    try {
        let email = req.body.email;
        let checkEmail = await functions.checkEmail(email);
        if (checkEmail) {
            let verify = await Users.findOne({ email: email, type: 0 });
            if (verify != null) {
                //tạo otp
                let otp = functions.randomNumber
                // gửi OTP qua mail 
                let send = await functions.sendEmailVerificationRequest(otp, email, verify.userName)
                let RecOPT = send.otp
                if (otp == RecOPT) {
                    await Users.updateOne({ email: email }, {
                        $set: {
                            otp: otp
                        }
                    });
                    const token = await functions.createToken(verify, '30m')
                    return functions.success(res, 'xác thực thành công', { token })
                }
                return functions.setError(res, 'chưa lấy được mã otp', 404)

            }
            return functions.setError(res, 'email không đúng', 404)
        }
        return functions.setError(res, 'sai định dạng email', 404)


    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm bước 2 của quên mật khẩu
exports.forgotPasswordCheckOTP = async (req, res, next) => {
    try {
        let email = req.user.data.email;
        let otp = req.body.ma_xt;
        if (otp) {
            let verify = await Users.findOne({ email: email, otp: otp, type: 0 });
            if (verify != null) {
                return functions.success(res, 'xác thực thành công')
            }
            return functions.setError(res, 'mã otp không đúng', 404)
        }
        return functions.setError(res, 'thiếu mã otp', 404)


    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm bước 3 của quên mật khẩu
exports.updatePassword = async (req, res, next) => {
    try {
        let email = req.user.data.email,
            password = req.body.password;
        if (password) {
            let checkPass = await functions.getDatafindOne(Users, { idQLC, password : md5(password), type : 0})
            if (!checkPass) {    
                await Users.updateOne({ idQLC: idQLC, type: 0 }, {
                    $set: {
                        password: md5(password)
                    }
                });
                return functions.success(res, 'đổi mật khẩu thành công')
            }else{
                return functions.setError(res,'mật khẩu đã tồn tại')
            }
        }
        return functions.setError(res, 'nhập lại mật khẩu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}
