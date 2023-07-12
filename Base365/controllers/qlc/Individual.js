const Users = require("../../models/Users")
const fnc = require("../../services/qlc/functions")
const functions = require("../../services/functions")

const md5 = require("md5")

//đăng kí tài khoản cá nhân 
exports.register = async(req, res) => {
    try {
        const { userName, password, phoneTK, address, phone, fromWeb } = req.body
        const createdAt = new Date()
        if (userName && password && phoneTK && address) {
            let checkPhone = await functions.checkPhoneNumber(phoneTK);
            if (checkPhone) {
                let user = await Users.findOne({ phoneTK: phoneTK, type:{ $ne : 1}}).lean()
                let MaxId = await functions.getMaxUserID("user")

                if (!user) {
                    const Inuser = new Users({
                        _id: MaxId._id,
                        userName: userName,
                        phoneTK: phoneTK,
                        phone: phone,
                        password: md5(password),
                        address: address,
                        createdAt: Date.parse(createdAt),
                        type: 0,
                        role: 0,
                        otp: null,
                        authentic: 0,
                        fromWeb: "quanlichung",
                        idQLC: MaxId._idQLC,
                        idTimViec365: MaxId._idTV365,
                        idRaoNhanh365: MaxId._idRN365,
                        "inForPerson.account.birthday": null,
                        "inForPerson.account.gender": 0,
                        "inForPerson.account.married": 0,
                        "inForPerson.account.experience": 0,
                        "inForPerson.account.education": 0,
                    })
                    await Inuser.save()
                    const token = await functions.createToken(Inuser, "1d")
                    const refreshToken = await functions.createToken({ userId: Inuser._id }, "1y")
                    let data = {
                        access_token: token,
                        refresh_token: refreshToken,
                    }
                    return functions.success(res, "tạo tài khoản thành công", { Inuser, data })
                } else {
                    return functions.setError(res, " sdt đã tồn tại")
                }
            } else {
                functions.setError(res, "định dạng sdt không đúng ")
            }
        } else {
            return functions.setError(res, "thiếu thông tin để đăng kí ")
        }
    } catch (e) {
        return functions.setError(res, e.message)
    }
}
exports.verify = async(req, res) => {
    try {
        let otp = req.body.ma_xt || null
        let phoneTK = req.user.data.phoneTK;
        let data = []
        if (otp) {
            let findUser = await Users.findOne({ phoneTK: phoneTK, type: 0 })
            if (findUser) {
                data = await Users.updateOne({ phoneTK: phoneTK, type: 0 }, {
                    $set: {
                        otp: otp
                    }
                })
                return functions.success(res, "lưu OTP thành công", { data, otp })
            } else {
                return functions.setError(res, "tài khoản không tồn tại")
            }


        } else if (!otp) {
            let verify = await Users.findOne({ phoneTK: phoneTK, type: 0 });
            if (verify) {
                await Users.updateOne({ phoneTK: phoneTK, type: 0 }, {
                    $set: {
                        authentic: 1
                    }
                });
                return functions.success(res, "xác thực thành công");
            } else {
                return functions.setError(res, "xác thực thất bại", 404);
            }


        } else {
            return functions.setError(res, "thiếu dữ liệu sdt", 404)
        }
    } catch (e) {
        return functions.setError(res, e.message)
    }
}
exports.verifyCheckOTP = async(req, res) => {
    try {
        let otp = req.body.ma_xt || null
        let phoneTK = req.user.data.phoneTK;

        if (otp) {
            let findUser = await Users.findOne({ phoneTK: phoneTK, type: 0 }).select("otp")
            if (findUser) {
                let data = findUser.otp
                if (data === otp) {
                    functions.success(res, "xác thực thành công")
                } else {
                    functions.setError(res, "xác thực thất bại")

                }
            } else {
                return functions.setError(res, "tài khoản không tồn tại")
            }
        } else {
            return functions.setError(res, "vui lòng nhập mã xác thực")

        }
    } catch (e) {
        return functions.setError(res, e.message)

    }
}

exports.login = async(req, res, next) => {
    try {
        let phoneTK = req.body.phoneTK
        let email = req.body.email
        password = req.body.password
        type_user = {};

        if (phoneTK && password) {

            let checkPhone = await functions.checkPhoneNumber(phoneTK)
            if (checkPhone) {
                let checkTypeUser = await Users.findOne({ phoneTK: phoneTK }).lean()
                if (checkTypeUser.type == 0) {
                    type_user = 0
                    let checkPassword = await functions.verifyPassword(password, checkTypeUser.password)
                    if (!checkPassword) {
                        return functions.setError(res, "Mật khẩu sai", 404)
                    }
                    if (checkTypeUser != null) {
                        const token = await functions.createToken(checkTypeUser, "1d")
                        const refreshToken = await functions.createToken({ userId: checkTypeUser._id }, "1y")
                        let data = {
                            access_token: token,
                            refresh_token: refreshToken,
                            com_info: {
                                com_id: checkTypeUser._id,
                                com_phone_tk: checkTypeUser.phoneTK,
                            }
                        }
                        data.type_user = type_user
                        return functions.success(res, 'Đăng nhập thành công bằng SDT', { data })

                    } else {
                        return functions.setError(res, "sai tai khoan hoac mat khau")
                    }
                } else if (checkTypeUser.type == 1) {
                    type_user = 1
                    functions.success(res, "tài khoản là tài khoản cty", { type_user })

                } else if (checkTypeUser.type == 2) {
                    type_user = 2
                    functions.success(res, "tài khoản là tài khoản nhân viên", { type_user })

                } else {
                    functions.setError(res, "không tìm thấy tài khoản ")
                }

            } else {
                return functions.setError(res, "không đúng định dạng SDT", 404)
            }
        } else if (email && password) {
            let checkMail = await functions.checkEmail(email)
            if (checkMail) {
                let checkTypeUser = await Users.findOne({ email: email }).lean()
                if (checkTypeUser.type == 0) {
                    type_user = 0
                    let checkPassword = await functions.verifyPassword(password, checkTypeUser.password)
                    if (!checkPassword) {
                        return functions.setError(res, "Mật khẩu sai", 404)
                    }
                    if (checkTypeUser != null) {
                        const token = await functions.createToken(checkTypeUser, "1d")
                        const refreshToken = await functions.createToken({ userId: checkTypeUser._id }, "1y")
                        let data = {
                            access_token: token,
                            refresh_token: refreshToken,
                            com_info: {
                                com_id: checkTypeUser._id,
                                com_email: checkTypeUser.email,
                            }
                        }
                        data.type_user = type_user
                        return functions.success(res, 'Đăng nhập thành công bằng email', { data })

                    } else {
                        return functions.setError(res, "sai tai khoan hoac mat khau")
                    }
                } else if (checkTypeUser.type == 1) {
                    type_user = 1
                    functions.success(res, "tài khoản là tài khoản công ty", { type_user })

                } else if (checkTypeUser.type == 2) {
                    type_user = 2
                    functions.success(res, "tài khoản là tài khoản nhân viên", { type_user })

                } else {
                    functions.setError(res, "không tìm thấy tài khoản ")
                }
            } else {
                return functions.setError(res, "không đúng định dạng email", 404)
            }
        } else {
            return functions.setError(res, "thiếu dữ liệu email hoặc sdt hoặc password ", 404)

        }
    } catch (error) {
        return functions.setError(res, error.message)
    }
}


// hàm đổi mật khẩu 
exports.updatePassword = async(req, res, next) => {
    try {
        let idQLC = req.user.data.idQLC
        let old_password = req.body.old_password
        let password = req.body.password;
        let re_password = req.body.re_password;
        let checkPassword = await functions.verifyPassword(password)
        if (checkPassword) {
            return functions.setError(res, "sai dinh dang Mk", 404)
        }
        if (!password || !re_password) {
            return functions.setError(res, 'điền thiếu thông tin', 400)
        }
        if (password.length < 6) {
            return functions.setError(res, 'Password quá ngắn', 400)
        }
        if (password !== re_password) {
            return functions.setError(res, 'Password nhập lại không trùng khớp', 400)
        }
        if (old_password) {
            let checkOldPassword = await Users.findOne({ idQLC: idQLC, password: md5(old_password), type: 0 })
            if (!checkOldPassword) {
                functions.setError(res, 'Mật khẩu cũ không đúng, vui lòng kiểm tra lại', 400)
            } else {
                let checkPass = await functions.getDatafindOne(Users, { idQLC, password: md5(password), type: 0 })
                if (!checkPass) {
                    await Users.updateOne({ idQLC: idQLC, type: 0 }, {
                        $set: {
                            password: md5(password),
                        }
                    });
                    return functions.success(res, 'cập nhập thành công')
                }
                return functions.setError(res, 'mật khẩu đã tồn tại, xin nhập mật khẩu khác ', 404)
            }
        }

    } catch (error) {
        return functions.setError(res, error)
    }
}

exports.updatePasswordbyInput = async(req, res, next) => {
        try {
            let phoneTK = req.body.phoneTK
            let email = req.body.email
            let password = req.body.password;
            let re_password = req.body.re_password;
            if (phoneTK && password) {
                let checkPassword = await functions.verifyPassword(password)
                if (checkPassword) {
                    return functions.setError(res, "sai dinh dang Mk", 404)
                }
                if (!password || !re_password) {
                    return functions.setError(res, 'Missing data', 400)
                }
                if (password.length < 6) {
                    return functions.setError(res, 'Password quá ngắn', 400)
                }
                if (password !== re_password) {
                    return functions.setError(res, 'Password nhập lại không trùng khớp', 400)
                }
                let checkPass = await functions.getDatafindOne(Users, { phoneTK, password: md5(password), type: 0 })
                if (!checkPass) {
                    await Users.updateOne({ phoneTK: phoneTK, type: 0 }, {
                        $set: {
                            password: md5(password),
                        }
                    });
                    return functions.success(res, 'cập nhập thành công')
                }
                return functions.setError(res, 'mật khẩu đã tồn tại, xin nhập mật khẩu khác ', 404)
            } else if (email && password) {
                let checkPassword = await functions.verifyPassword(password)
                if (checkPassword) {
                    return functions.setError(res, "sai dinh dang Mk", 404)
                }
                if (!password || !re_password) {
                    return functions.setError(res, 'Missing data', 400)
                }
                if (password.length < 6) {
                    return functions.setError(res, 'Password quá ngắn', 400)
                }
                if (password !== re_password) {
                    return functions.setError(res, 'Password nhập lại không trùng khớp', 400)
                }
                let checkPass = await functions.getDatafindOne(Users, { email, password: md5(password), type: 0 })
                if (!checkPass) {
                    await Users.updateOne({ email: email, type: 0 }, {
                        $set: {
                            password: md5(password),
                        }
                    });
                    return functions.success(res, 'cập nhập thành công')
                }
                return functions.setError(res, 'mật khẩu đã tồn tại, xin nhập mật khẩu khác ', 404)

            } else {
                return functions.setError(res, ' điền thiếu trường ', 404)
            }

        } catch (error) {
            return functions.setError(res, error.message)
        }
    }
    // hàm cập nhập thông tin cá nhân
exports.updateInfoindividual = async(req, res, next) => {
    try {
        let idQLC = req.user.data.idQLC;
        let data = [];
        const { userName, email, phoneTK, com_id, address, position_id, dep_id, phone, group_id, birthday, gender, married, experience, startWorkingTime, education, otp } = req.body;
        let updatedAt = new Date()
        let File = req.files || null;
        let avatarUser = null;
        if ((idQLC) !== undefined) {
            let findUser = Users.findOne({ idQLC: idQLC, type: 0 })
            if (findUser) {
                if (File && File.avatarUser) {
                    let upload = await fnc.uploadAvaEmpQLC( idQLC, File.avatarUser, ['.jpeg', '.jpg', '.png']);
                    if (!upload) {
                        return functions.setError(res, 'Định dạng ảnh không hợp lệ', 400)
                    }
                    avatarUser = upload
                }
                 data = await Users.updateOne({ idQLC: idQLC, type: 0 }, {
                        $set: {
                            userName: userName,
                            email: email,
                            phoneTK: phoneTK,
                            phone: phone,
                            avatarUser: avatarUser,
                            address: address,
                            otp: otp,
                            authentic: null || 0,
                            fromWeb: "quanlichung.timviec365",
                            avatarUser: avatarUser,
                            updatedAt: Date.parse(updatedAt),
                            "inForPerson.employee.group_id": group_id,
                            "inForPerson.account.birthday": birthday,
                            "inForPerson.account.gender": gender,
                            "inForPerson.account.married": married,
                            "inForPerson.account.experience": experience,
                            "inForPerson.employee.startWorkingTime": startWorkingTime,
                            "inForPerson.account.education": education,
                        }
                    })
                    return functions.success(res, 'update info user success', { data })
                
            } else {
                return functions.setError(res, "không tìm thấy user")

            }

        } else {
            return functions.setError(res, "không tìm thấy token")
        }
    } catch (error) {
        return functions.setError(res, error.message)
    }
}


// hàm bước 1 của quên mật khẩu
exports.forgotPassword = async(req, res) => {
    try {
        let otp = req.body.ma_xt || null
        let phoneTK = req.body.phoneTK;
        let email = req.body.email;
        let password = req.body.password;
        let re_password = req.body.re_password;
        let data = []
        if ((phoneTK || email) && (!otp)) {
            let checkMail = await functions.checkEmail(email)
            let checkPhone = await functions.checkPhoneNumber(phoneTK)
            if (checkMail || checkPhone) {
                let findUser = await Users.findOne({ $or: [{ email: email, type: 0 }, { phoneTK: phoneTK, type: 0 }] })
                if (findUser) {
                    let otp = functions.randomNumber
                    data = await Users.updateOne({ $or: [{ email: email, type: 0 }, { phoneTK: phoneTK, type: 0 }] }, {
                        $set: {
                            otp: otp
                        }
                    })
                    return functions.success(res, "Gửi mã OTP thành công", { data, otp })
                } else {
                    return functions.setError(res, "tài khoản không tồn tại")
                }
            } else {
                return functions.setError(res, " email không đúng định dạng ", 404)
            }

        } else if (otp && (phoneTK || email)) {
            let verify = await Users.findOne({ $or: [{ email: email, otp, type: 0 }, { phoneTK: phoneTK, otp, type: 0 }] });
            if (verify != null) {
                await Users.updateOne({ $or: [{ email: email, type: 0 }, { phoneTK: phoneTK, type: 0 }] }, {
                    $set: {
                        authentic: 1
                    }
                });
                return functions.success(res, "xác thực thành công");



            } else {
                return functions.setError(res, "xác thực thất bại", 404);
            }
        } else if (password && re_password) {
            let checkPassword = await functions.verifyPassword(password)
            if (!checkPassword) {
                return functions.setError(res, "sai dinh dang Mk", 404)
            }
            if (!password && !re_password) {
                return functions.setError(res, 'Missing data', 400)
            }
            if (password.length < 6) {
                return functions.setError(res, 'Password quá ngắn', 400)
            }
            if (password !== re_password) {
                return functions.setError(res, 'Password nhập lại không trùng khớp', 400)
            }
            await Users.updateOne({ $or: [{ email: email, authentic: 1, type: 0 }, { phoneTK: phoneTK, authentic: 1, type: 0 }] }, {
                $set: {
                    password: md5(password),
                }
            });
            return functions.success(res, 'cập nhập MK thành công')

        } else {
            return functions.setError(res, "thiếu dữ liệu", 404)
        }
    } catch (e) {
        return functions.setError(res, e.message)
    }
}

exports.info = async(req, res) => {
    try {
        const idQLC = req.user.data.idQLC
            // const com_id = req.user.data.com_id
        if ((idQLC) == undefined) {
            functions.setError(res, " không tìm thấy thông tin từ token ")
        } else if (isNaN(idQLC)) {
            functions.setError(res, "id phải là số")
        } else {

            const data = await Users.findOne({ idQLC: idQLC, type: 0 }).select('userName email phone phoneTK address avatarUser authentic inForPerson.account.birthday inForPerson.account.gender inForPerson.account.married inForPerson.account.experience inForPerson.account.education').lean()
            const birthday = data.inForPerson.account.birthday
            const gender = data.inForPerson.account.gender
            const married = data.inForPerson.account.married
            const experience = data.inForPerson.account.experience
            const education = data.inForPerson.account.education

            data.birthday = birthday
            data.gender = gender
            data.married = married
            data.experience = experience
            data.education = education
            if (data) {
                return functions.success(res, 'Lấy thành công', { data });
            };
            return functions.setError(res, 'Không có dữ liệu', 404);
        }
    } catch (e) {
        return functions.setError(res, e.message)
    }
}