const { isNull } = require('util');
const { deflateSync } = require('zlib');

const fnc = require('../../services/qlc/functions')
const functions = require("../../services/functions")
const md5 = require('md5');

const Users = require('../../models/Users');
const Deparment = require("../../models/qlc/Deparment");
const TimeSheet = require("../../models/qlc/TimeSheets");

//đăng kí tài khoản nhân viên 
exports.register = async(req, res) => {
    try {
        const { userName, emailContact, phoneTK, password, com_id, address, position_id, dep_id, phone, avatarUser, role, group_id, birthday, gender, married, experience, startWorkingTime, education, otp, team_id } = req.body;
        const createdAt = new Date();

        if ((userName && password && com_id && address && phoneTK) !== undefined) {
            let checkPhone = await functions.checkPhoneNumber(phoneTK);
            if (checkPhone) {
                let user = await Users.findOne({ phoneTK: phoneTK, type: { $ne: 1 } }).lean()
                let MaxId = await functions.getMaxUserID("user")
                let _id = MaxId._id
                if (!user) {
                    const user = new Users({
                        _id: _id,
                        emailContact: emailContact,
                        phoneTK: phoneTK,
                        userName: userName,
                        phone: phone,
                        avatarUser: avatarUser,
                        type: 2,
                        password: md5(password),
                        address: address,
                        createdAt: functions.getTimeNow(),
                        fromWeb: "quanlychung",
                        chat365_secret: Buffer.from(_id.toString()).toString('base64'),
                        role: 0,
                        avatarUser: null,
                        idQLC: MaxId._idQLC,
                        idTimViec365: MaxId._idTV365,
                        idRaoNhanh365: MaxId._idRN365,
                        "inForPerson.employee.position_id": position_id,
                        "inForPerson.employee.com_id": com_id,
                        "inForPerson.employee.dep_id": dep_id,
                        "inForPerson.employee.group_id": group_id,
                        "inForPerson.employee.team_id": team_id,
                        "inForPerson.account.birthday": Date.parse(birthday) / 1000,
                        "inForPerson.account.gender": gender,
                        "inForPerson.account.married": married,
                        "inForPerson.account.experience": experience,
                        // "inForPerson.employee.start_working_time": Date.parse(startWorkingTime) / 1000,
                        "inForPerson.account.education": education,
                    })
                    await user.save();

                    const token = await functions.createToken({
                        _id: user._id,
                        idTimViec365: user.idTimViec365,
                        idQLC: user.idQLC,
                        idRaoNhanh365: user.idRaoNhanh365,
                        emailContact: user.emailContact,
                        phoneTK: user.phoneTK,
                        createdAt: user.createdAt,
                        type: user.type,
                        com_id: user.inForPerson.employee.com_id,
                        userName: user.userName,
                        position_id: user.inForPerson.employee.position_id,
                        dep_id: user.inForPerson.employee.dep_id,
                        group_id: user.inForPerson.employee.group_id,
                        team_id: user.inForPerson.employee.team_id,
                        // startWorkingTime: user.inForPerson.employee.startWorkingTime,
                        married: user.inForPerson.account.married,
                        experience: user.inForPerson.account.experience,
                        education: user.inForPerson.account.education,
                    }, "1d")
                    const refreshToken = await functions.createToken({ userId: user._id }, "1y")
                    let data = {
                        access_token: token,
                        refresh_token: refreshToken,
                    }
                    return functions.success(res, "tạo tài khoản thành công", { user, data })
                } else {
                    return functions.setError(res, 'SDT đã tồn tại');
                }
            } else {
                return functions.setError(res, ' định dạng sdt không đúng');
            }
        } else {
            return functions.setError(res, 'Một trong các trường yêu cầu bị thiếu')
        }
    } catch (e) {
        return functions.setError(res, e.message)
    }

}

// hàm gửi otp qua gmail khi kích hoạt tài khoản
exports.verify = async(req, res) => {
    try {
        let otp = req.body.ma_xt || null
        let phoneTK = req.user.data.phoneTK;
        let data = []
        if (otp) {
            data = await Users.updateOne({ phoneTK: phoneTK, type: 2 }, {
                $set: {
                    otp: otp
                }
            });
            return functions.success(res, "lưu OTP thành công", { data })
        } else if (!otp) {
            await Users.updateOne({ phoneTK: phoneTK, type: 2 }, {
                $set: {
                    authentic: 1
                }
            });
            return functions.success(res, "xác thực thành công");
        } else {
            return functions.setError(res, "thiếu dữ liệu sdt")
        };
    } catch (e) {
        return functions.setError(res, e.message)
    }
}
exports.verifyCheckOTP = async(req, res) => {
    try {
        let otp = req.body.ma_xt || null
        let phoneTK = req.user.data.phoneTK;

        if (otp) {
            let findUser = await Users.findOne({ phoneTK: phoneTK, type: 2 }).select("otp")
            if (findUser) {
                let data = findUser.otp
                if (data === otp) {
                    return functions.success(res, "xác thực thành công")
                } else {
                    return functions.setError(res, "xác thực thất bại")
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


//hàm đăng nhập
exports.login = async(req, res, next) => {
    try {
        let request = req.body,
            account = request.account,
            password = request.password,
            pass_type = request.pass_type;
        let type = request.type;
        if (account && password && type) {
            let user;

            if (!pass_type) {
                password = md5(password);
            }
            if (!await functions.checkPhoneNumber(account)) {
                user = await Users.findOne({
                    email: account,
                    password: password,
                    type: type
                }).lean();
            } else {
                user = await Users.findOne({
                    phoneTK: account,
                    password: password,
                    type: type
                }).lean();
            }

            if (user) {
                let com_id = 0;
                if (user.type === 1) {
                    com_id = user.idQLC;
                } else if (user.type == 2 && user.inForPerson != null) {
                    com_id = user.inForPerson.employee.com_id;
                }
                const token = await functions.createToken({
                    _id: user._id,
                    idTimViec365: user.idTimViec365,
                    idQLC: user.idQLC,
                    idRaoNhanh365: user.idRaoNhanh365,
                    email: user.email,
                    phoneTK: user.phoneTK,
                    createdAt: user.createdAt,
                    type: user.type,
                    com_id: com_id,
                    userName: user.userName,
                }, "1d")
                const refreshToken = await functions.createToken({ userId: user._id }, "1y")
                let data = {
                    access_token: token,
                    refresh_token: refreshToken,
                    com_info: {
                        com_id: user._id,
                        com_email: user.email,
                    },
                    authentic: user.authentic
                }
                data.type = type;
                return functions.success(res, 'Đăng nhập thành công', { data });
            } else {
                // Nếu là tài khoản công ty thì tìm tài khoản của đối tượng còn lại
                if (type == 1) {
                    if (!await functions.checkPhoneNumber(account)) {
                        user = await Users.findOne({
                            email: account,
                            password: password,
                            type: { $ne: 1 }
                        }).lean();
                    } else {
                        user = await Users.findOne({
                            phoneTK: account,
                            password: password,
                            type: { $ne: 1 }
                        }).lean();
                    }
                }
                // Còn nếu là tài khoản nhân viên hoặc cá nhân
                else {
                    if (!await functions.checkPhoneNumber(account)) {
                        user = await Users.findOne({
                            email: account,
                            password: password,
                            type: { $in: [0, 1, 2] }
                        });
                    } else {
                        user = await Users.findOne({
                            phoneTK: account,
                            password: password,
                            type: { $in: [0, 1, 2] }
                        });
                    }
                }
                if (user) {
                    let com_id = 0;
                    if (user.type === 1) {
                        com_id = user.idQLC;
                    } else if (user.inForPerson && user.type == 2) {
                        com_id = user.inForPerson.employee.com_id;
                    }
                    const token = await functions.createToken({
                        _id: user._id,
                        idTimViec365: user.idTimViec365,
                        idQLC: user.idQLC,
                        idRaoNhanh365: user.idRaoNhanh365,
                        email: user.email,
                        phoneTK: user.phoneTK,
                        createdAt: user.createdAt,
                        type: user.type,
                        com_id: com_id,
                        userName: user.userName,
                    }, "1d")
                    const refreshToken = await functions.createToken({ userId: user._id }, "1y")
                    let data = {
                        access_token: token,
                        refresh_token: refreshToken,
                        authentic: user.authentic,
                    }
                    data.type = user.type;
                    return functions.success(res, 'Đăng nhập thành công', { data });
                }
                return functions.setError(res, "Tài khoản không tồn tại");
            }
        }
        return functions.setError(res, "Chưa đủ thông tin truyền lên");

    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

// hàm đổi mật khẩu 
exports.updatePasswordbyToken = async(req, res, next) => {
    try {
        let idQLC = req.user.data.idQLC
        let old_password = req.body.old_password
        let password = req.body.password;
        if (!password) {
            return functions.setError(res, 'điền thiếu thông tin')
        }
        if (password.length < 6) {
            return functions.setError(res, 'Password quá ngắn')
        }
        if (old_password) {
            let checkOldPassword = await Users.findOne({ idQLC: idQLC, password: md5(old_password), type: 2 })
            if (checkOldPassword) {
                await Users.updateOne({ idQLC: idQLC, type: 2 }, {
                    $set: {
                        password: md5(password),
                    }
                });
                return functions.success(res, 'cập nhập thành công')
            }
            return functions.setError(res, 'Mật khẩu cũ không đúng, vui lòng kiểm tra lại')
        }
    } catch (error) {
        return functions.setError(res, error.message)
    }
}
exports.updatePasswordbyInput = async(req, res, next) => {
    try {
        let phoneTK = req.body.phoneTK
        let email = req.body.email
        let password = req.body.password;
        if (phoneTK && password) {
            if (password.length < 6) {
                return functions.setError(res, 'Password quá ngắn')
            }
            let checkPass = await functions.getDatafindOne(Users, { phoneTK, password: md5(password), type: 2 })
            if (!checkPass) {
                await Users.updateOne({ phoneTK: phoneTK, type: 2 }, {
                    $set: {
                        password: md5(password),
                    }
                });
                return functions.success(res, 'cập nhập thành công')
            }
            return functions.setError(res, 'mật khẩu đã tồn tại, xin nhập mật khẩu khác ');
        } else if (email && password) {
            if (password.length < 6) {
                return functions.setError(res, 'Password quá ngắn')
            }
            let checkPass = await functions.getDatafindOne(Users, { email, password: md5(password), type: 2 })
            if (!checkPass) {
                await Users.updateOne({ email: email, type: 2 }, {
                    $set: {
                        password: md5(password),
                    }
                });
                return functions.success(res, 'cập nhập thành công')
            }
            return functions.setError(res, 'mật khẩu đã tồn tại, xin nhập mật khẩu khác ');
        } else {
            return functions.setError(res, ' điền thiếu trường ')
        };

    } catch (error) {
        return functions.setError(res, error.message)
    }
}


// hàm cập nhập thông tin nhan vien
exports.updateInfoEmployee = async(req, res, next) => {
    try {
        let idQLC = req.user.data.idQLC;
        let data = [];
        const { userName, emailContact, phoneTK, password, com_id, address, position_id, dep_id, phone, group_id, birthday, gender, married, experience, startWorkingTime, education, otp } = req.body;
        let updatedAt = new Date()
        let File = req.files || null;
        let avatarUser = null;
        if ((idQLC) !== undefined) {
            let findUser = await Users.findOne({ idQLC: idQLC, type: 2 })
            if (findUser) {
                if (File && File.avatarUser) {
                    let upload = await fnc.uploadAvaEmpQLC(idQLC, File.avatarUser, ['.jpeg', '.jpg', '.png']);
                    if (!upload) {
                        return functions.setError(res, 'Định dạng ảnh không hợp lệ')
                    }
                    avatarUser = upload
                }
                data = await Users.updateOne({ idQLC: idQLC, type: 2 }, {
                    $set: {
                        userName: userName,
                        emailContact: emailContact,
                        phone: phone,
                        avatarUser: avatarUser,
                        "inForPerson.employee.position_id": position_id,
                        "inForPerson.employee.com_id": com_id,
                        "inForPerson.employee.dep_id": dep_id,
                        address: address,
                        otp: otp,
                        avatarUser: avatarUser,
                        updatedAt: functions.getTimeNow(),
                        "inForPerson.employee.group_id": group_id,
                        "inForPerson.account.birthday": birthday?Date.parse(birthday) / 1000:undefined,
                        "inForPerson.account.gender": gender,
                        "inForPerson.account.married": married,
                        "inForPerson.account.experience": experience,
                        "inForPerson.employee.start_working_time": startWorkingTime,
                        "inForPerson.account.education": education,
                    }
                })
                return functions.success(res, 'cập nhật thành công')
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

// // hàm quên mật khẩu
// exports.forgotPassword = async(req, res) => {
//     try {
//         let otp = req.body.ma_xt || null
//         let phoneTK = req.body.phoneTK;
//         let email = req.body.email;
//         let password = req.body.password;
//         let re_password = req.body.re_password;
//         let data = []
//         if ((phoneTK || email) && (!otp)) {
//             let checkMail = await functions.checkEmail(email)
//             let checkPhone = await functions.checkPhoneNumber(phoneTK)
//             if (checkMail || checkPhone) {
//                 let findUser = await Users.findOne({ $or: [{ email: email, type: 2 }, { phoneTK: phoneTK, type: 2 }] })
//                 if (findUser) {
//                     let otp = functions.randomNumber
//                     data = await Users.updateOne({ $or: [{ email: email, type: 2 }, { phoneTK: phoneTK, type: 2 }] }, {
//                         $set: {
//                             otp: otp
//                         }
//                     })
//                     return functions.success(res, "Gửi mã OTP thành công", { data, otp })
//                 } else {
//                     return functions.setError(res, "tài khoản không tồn tại")
//                 }
//             } else {
//                 return functions.setError(res, " email không đúng định dạng ")
//             }

//         } else if (otp && (phoneTK || email)) {
//             let verify = await Users.findOne({ $or: [{ email: email, otp, type: 2 }, { phoneTK: phoneTK, otp, type: 2 }] });
//             if (verify != null) {
//                 await Users.updateOne({ $or: [{ email: email, type: 2 }, { phoneTK: phoneTK, type: 2 }] }, {
//                     $set: {
//                         authentic: 1
//                     }
//                 });
//                 await functions.success(res, "xác thực thành công");



//             } else {
//                 return functions.setError(res, "xác thực thất bại");
//             }
//         } else if (password && re_password) {
//             let checkPassword = await functions.verifyPassword(password)
//             if (!checkPassword) {
//                 return functions.setError(res, "sai dinh dang Mk")
//             }
//             if (!password && !re_password) {
//                 return functions.setError(res, 'Missing data')
//             }
//             if (password.length < 6) {
//                 return functions.setError(res, 'Password quá ngắn')
//             }
//             if (password !== re_password) {
//                 return functions.setError(res, 'Password nhập lại không trùng khớp')
//             }
//             await Users.updateOne({ $or: [{ email: email, authentic: 1, type: 2 }, { phoneTK: phoneTK, authentic: 1, type: 2 }] }, {
//                 $set: {
//                     password: md5(password),
//                 }
//             });
//             return functions.success(res, 'cập nhập MK thành công')

//         } else {
//             return functions.setError(res, "thiếu dữ liệu")
//         }
//     } catch (e) {
//         return functions.setError(res, e.message)
//     }
// }


// show info
exports.info = async(req, res) => {
    try {
        const user = req.user.data;
        let idQLC = user.idQLC;
        const com_id = user.com_id;

        if (req.body.idQLC && user.type == 1) {
            idQLC = Number(req.body.idQLC);
        }

        const data = await Users.aggregate([{
                $match: { idQLC: idQLC, type: 2 }
            },
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
                    "userName": "$userName",
                    "dep_id": "$inForPerson.employee.dep_id",
                    "com_id": "$inForPerson.employee.com_id",
                    "position_id": "$inForPerson.employee.position_id",
                    "start_working_time": "$inForPerson.employee.start_working_time",
                    "idQLC": "$idQLC",
                    "phoneTK": "$phoneTK",
                    "phone": "$phone",
                    "address": "$address",
                    "avatarUser": "$avatarUser",
                    "authentic": "$authentic",
                    "birthday": "$inForPerson.account.birthday",
                    "gender": "$inForPerson.account.gender",
                    "married": "$inForPerson.account.married",
                    "experience": "$inForPerson.account.experience",
                    "education": "$inForPerson.account.education",
                    "emailContact": "$emailContact",
                    "idQLC": "$idQLC",
                    "nameDeparment": "$deparment.dep_name",
                    "inForPerson":1
                }
            }
        ]);
        if (data.length > 0) {
            const user = data[0];
            let companyName = await Users.findOne({ idQLC: user.com_id, type: 1 }).select('userName').lean();
            if (companyName) user.companyName = companyName;

            user.avatarUser = await fnc.createLinkFileEmpQLC(user.idQLC, user.avatarUser);
            user.nameDeparment = user.nameDeparment.toString();

            return functions.success(res, "lấy thành công", { data: user })
        }
        return functions.setError(res, " không tìm thấy nhân viên ")

    } catch (e) {
        return functions.setError(res, e.message)
    }
}

exports.home = async(req, res) => {
    try {
        const user = req.user.data;

    } catch (error) {
        return functions.setError(res, err.message);
    }
}


