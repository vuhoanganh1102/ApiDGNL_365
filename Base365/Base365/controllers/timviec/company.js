const md5 = require('md5');

const Users = require('../../models/Users');
const functions = require('../../services/functions');
const nopHoSo = require('../../models/Timviec365/UserOnSite/Candicate/ApplyForJob');
const NewTV365 = require('../../models/Timviec365/UserOnSite/Company/New');
const SaveCandidate = require('../../models/Timviec365/UserOnSite/Company/SaveCandidate');
const PointCompany = require('../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointCompany');
const PointUsed = require('../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointUsed');
const CompanyUnset = require('../../models/Timviec365/UserOnSite/Company/UserCompanyUnset');
const AdminUser = require('../../models/AdminUser');
const CategoryCompany = require('../../models/Timviec365/UserOnSite/Company/CategoryCompany')
const CV = require('../../models/Timviec365/CV/CV')

// hàm đăng ký
exports.register = async(req, res, next) => {
    try {
        let request = req.body,
            email = request.email,
            phone = request.phone,
            username = request.usc_name,
            password = request.password,
            city = request.usc_city,
            district = request.usc_qh,
            address = request.usc_address,
            mst = request.thue,
            linkVideo = request.linkVideo,
            description = request.usc_mota,
            fromDevice = request.fromDevice,
            fromWeb = request.fromWeb,
            avatarUser = req.files.logo,
            ipAddressRegister = request.ipAddressRegister,
            videoType = req.files.videoType,
            lv = request.usc_lv,
            video = '',
            link = '',
            avatar = "",
            lvID = 0,
            listIDKD = [],
            idKD = 0,
            empID = 0;
        console.log(req.files)
            // check dữ liệu không bị undefined
        if ((username && password && city && district &&
                address && email && phone) !== undefined) {
            // validate email,phone
            let CheckEmail = await functions.checkEmail(email),
                CheckPhoneNumber = await functions.checkPhoneNumber(phone);
            if ((CheckPhoneNumber && CheckEmail) == true) {
                //  check email co trong trong database hay khong
                let user = await functions.getDatafindOne(Users, { email })
                if (user == null) {
                    //check video
                    if (videoType) {
                        if (videoType.length == 1) {
                            let checkVideo = await functions.checkVideo(videoType[0]);
                            if (checkVideo) {
                                video = videoType[0].filename
                            } else {
                                await functions.deleteImg(videoType[0])
                                if (avatarUser) {
                                    await functions.deleteImg(avatarUser[0])
                                }
                                return functions.setError(res, 'video không đúng định dạng hoặc lớn hơn 100MB ', 404)
                            }
                        } else if (videoType.length > 1) {
                            return functions.setError(res, 'chỉ được đăng 1 video', 404)
                        }
                    }

                    //check ảnh
                    if (avatarUser) {
                        if (avatarUser.length == 1) {
                            let checkImg = await functions.checkImage(avatarUser[0].path);
                            if (checkImg) {
                                avatar = avatarUser[0].filename
                            } else {
                                if (videoType) {
                                    await functions.deleteImg(videoType[0])
                                }
                                await functions.deleteImg(avatarUser[0]);
                                return functions.setError(res, `sai định dạng ảnh hoặc ảnh lớn hơn 2MB :${avatarUser[0].originalname}`, 404);
                            }
                        } else if (avatarUser.length > 1) {
                            return functions.setError(res, 'chỉ được đăng 1 ảnh', 404)
                        }
                    }

                    // check link video
                    if (linkVideo) {
                        let checkLink = await functions.checkLink(linkVideo);
                        if (checkLink) {
                            link = linkVideo;
                        } else {
                            if (videoType) {
                                await functions.deleteImg(videoType[0])
                            }
                            if (avatarUser) {
                                await functions.deleteImg(avatarUser[0])
                            }
                            return functions.setError(res, 'link không đúng định dạng ', 404)
                        }
                    }
                    if (lv == undefined) {
                        let data = {
                            title_company: username,
                            description_company: description,
                            number: 1
                        }
                        let dataLV = await functions.getDataAxios('http://43.239.223.10:5001/recognition_tag_company', data);
                        lvID = dataLV.data.items[0].id_tag;
                    }
                    // lấy danh sách id bộ phận
                    let listKD = await functions.getDatafind(AdminUser, { bophan: 1 });
                    let listUser = await Users.find({ 'inForCompany.idKD': { $ne: 0 } }).sort({ _id: -1 }).limit(1);
                    if (listUser.length > 0) {
                        let idKDUser = listUser[0].inForCompany.idKD;
                        for (let i = 0; i < listKD.length; i++) {
                            listIDKD.push(listKD[i].stt)
                        }
                        // tìm vị trí của idKd của người đăng ký mới nhất
                        let index = listIDKD.findIndex(id => id == idKDUser);
                        if (index !== -1) {
                            if (index === listIDKD.length - 1) {
                                idKD = listIDKD[0];
                            } else {
                                idKD = listIDKD[index + 1];
                            }
                        }
                    }
                    // tìm Id max trong DB
                    let maxID = await functions.getMaxID(Users) || 0;
                    let maxIDTimviec = await (Users.findOne({ type: 1 }).sort({ idTimViec365: -1 }).lean()) || 0;
                    let newIDTimViec = maxIDTimviec.idTimViec365 || 0;
                    let adminKD = await functions.getDatafindOne(AdminUser, { bophan: idKD });
                    if (adminKD) {
                        empID = adminKD.empID;
                    }
                    // data gửi đến bộ phận nhân sự qua app chat
                    let dataSendChatApp = {
                        ContactId: empID,
                        SenderID: 1191,
                        MessageType: 'text',
                        Message: `${username} vừa đăng ký tài khoản nhà tuyển dụng trên timviec365.vn`,
                        LiveChat: { "ClientId": "200504_liveChatV2", "ClientName": username, "FromWeb": "timviec365.vn", "FromConversation": "506685" },
                        InfoSupport: { "Title": "Hỗ trợ", "Status": 1 },
                        MessageInforSupport: `Xin chào, tôi tên là ${username},SĐT: ${phone} `,
                        Email: `${email},tôi vừa đăng ký tài khoản NTD trên timviec365.vn,tôi cần bạn hỗ trợ !`
                    }
                    const company = new Users({
                        _id: (Number(maxID) + 1),
                        email: email,
                        password: md5(password),
                        phone: phone,
                        userName: username,
                        type: 1,
                        city: city,
                        district: district,
                        address: address,
                        avatarUser: avatar,
                        createdAt: new Date().getTime(),
                        role: 1,
                        authentic: 0,
                        fromWeb: fromWeb || null,
                        fromDevice: fromDevice || null,
                        idTimViec365: (Number(newIDTimViec) + 1),
                        inForCompany: {
                            idKD: idKD,
                            mst: mst,
                            videoType: video || null,
                            linkVideo: link || null,
                            description: description || null,
                            userContactName: username,
                            userContactPhone: phone,
                            userContactAddress: address,
                            userContactEmail: email,
                            ipAddressRegister: ipAddressRegister,
                            lv: lvID
                        }
                    });
                    await company.save();
                    // gửi cho bộ phận nhân sự qua appchat
                    // await functions.getDataAxios('http://43.239.223.142:9000/api/message/SendMessage_v2', dataSendChatApp)
                    let companyUnset = await functions.getDatafindOne(CompanyUnset, { email })
                    if (companyUnset != null) {
                        await functions.getDataDeleteOne(CompanyUnset, { email })
                    }

                    return functions.success(res, 'đăng ký thành công')
                } else {
                    if (videoType) {
                        await functions.deleteImg(videoType[0])
                    }
                    if (avatarUser) {
                        await functions.deleteImg(avatarUser[0])
                    }
                    return functions.setError(res, 'email đã tồn tại', 404)
                }
            } else {
                if (videoType) {
                    await functions.deleteImg(videoType[0])
                }
                if (avatarUser) {
                    await functions.deleteImg(avatarUser[0])
                }
                return functions.setError(res, 'email hoặc số điện thoại định dạng không hợp lệ', 404)
            }

        } else {
            if (videoType) {
                await functions.deleteImg(videoType[0])
            }
            if (avatarUser) {
                await functions.deleteImg(avatarUser[0])
            }

            return functions.setError(res, 'Thiếu dữ liệu', 404)
        }
    } catch (error) {
        console.log(error)
        if (videoType) {
            await functions.deleteImg(videoType[0])
        }
        if (avatarUser) {
            await functions.deleteImg(avatarUser[0])
        }
        return functions.setError(res, error)
    }
}

// hàm dăng nhập
exports.login = async(req, res, next) => {

    if (req.body.email && req.body.password) {
        const type = 1;
        const email = req.body.email
        const password = req.body.password

        let checkPhoneNumber = await functions.checkEmail(email);
        if (checkPhoneNumber) {
            let findUser = await functions.getDatafindOne(Users, { email })
            if (!findUser) {
                return functions.setError(res, "không tìm thấy tài khoản trong bảng user", 404)
            }
            let checkPassword = await functions.verifyPassword(password, findUser.password)
            if (!checkPassword) {
                return functions.setError(res, "Mật khẩu sai", 404)
            }
            if (findUser.type == type) {
                const token = await functions.createToken(findUser, "1d")
                const refreshToken = await functions.createToken({ userId: findUser._id }, "1y")
                let data = {
                    access_token: token,
                    refresh_token: refreshToken,
                    user_info: {
                        usc_id: findUser._id,
                        usc_email: findUser.email,
                        usc_phone_tk: findUser.phoneTK,
                        usc_pass: findUser.password,
                        usc_company: findUser.userName,
                        usc_logo: findUser.avatarUser,
                        usc_phone: findUser.phone,
                        usc_city: findUser.city,
                        usc_qh: findUser.district,
                        usc_address: findUser.address,
                        usc_create_time: findUser.createdAt,
                        usc_update_time: findUser.updatedAt,
                        usc_active: findUser.lastActivedAt,
                        usc_authentic: findUser.authentic,
                        usc_lat: findUser.latitude,
                        usc_long: findUser.longtitude,
                        usc_name: findUser.inForCompany.userContactName,
                        usc_name_add: findUser.inForCompany.userContactAddress,
                        usc_name_phone: findUser.inForCompany.userContactPhone,
                        usc_name_email: findUser.inForCompany.userContactEmail,
                    }
                }
                return functions.success(res, 'Đăng nhập thành công', data)
            } else return functions.setError(res, "tài khoản này không phải tài khoản công ty", 404)


        } else {
            return functions.setError(res, "không đúng định dạng email", 404)
        }
    }
};

// hàm lấy user khi đăng ký sai
exports.registerFall = async(req, res, next) => {
    try {
        let request = req.body,
            email = request.email,
            phone = request.phone,
            nameCompany = request.nameCompany,
            city = request.city,
            district = request.district,
            address = request.address,
            regis = request.regis;
        let maxID = await functions.getMaxID(CompanyUnset) || 1;
        if ((email) != undefined) {
            // check email ,phone
            let checkEmail = await functions.checkEmail(email)
            let CheckPhoneNumber = await functions.checkPhoneNumber(phone)
            if ((checkEmail && CheckPhoneNumber) == true) {
                let company = await functions.getDatafindOne(CompanyUnset, { email })
                if (company == null) {
                    const companyUnset = new CompanyUnset({
                        _id: (Number(maxID) + 1),
                        email: email,
                        nameCompany: nameCompany | null,
                        type: 1,
                        phone: phone,
                        city: city | null,
                        district: district | null,
                        address: address || null,
                        errTime: new Date().getTime(),
                        regis: regis || null

                    });
                    await companyUnset.save();
                    return functions.success(res, 'tạo thành công')

                } else {
                    await CompanyUnset.updateOne({ email: email }, {
                        $set: {
                            nameCompany: nameCompany,
                            phone: phone,
                            city: city,
                            district: district,
                            address: address,
                            errTime: new Date().getTime(),
                            regis: regis
                        }
                    });
                    return functions.success(res, 'update thành công')


                }
            } else {
                return functions.setError(res, 'email hoặc số điện thoại không đúng định dạng', 404)
            }
        } else {
            return functions.setError(res, 'thiếu dữ liệu gmail', 404)

        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm gửi otp qua gmail khi kích hoạt tài khoản
exports.sendOTP = async(req, res, next) => {
    try {
        let email = req.body.email;
        if (email != undefined) {
            let checkEmail = await functions.checkEmail(email)
            if (checkEmail) {
                let user = await functions.getDatafindOne(Users, { email })
                if (user) {
                    let otp = await functions.randomNumber
                    await Users.updateOne({ email: email }, {
                        $set: {
                            otp: otp
                        }
                    });
                    await functions.sendEmailVerificationRequest(otp, email, user.userName)
                    return functions.success(res, 'Gửi mã OTP thành công', )
                }
                return functions.setError(res, 'tài khoản không tồn tại', 404)
            } else {
                return functions.setError(res, 'email không đúng định dạng', 404)
            }
        } else {
            return functions.setError(res, 'thiếu dữ liệu gmail', 404)
        }

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm xác nhận otp để kích hoạt tài khoản
exports.verify = async(req, res, next) => {
    try {
        let otp = req.body.ma_xt,
            email = req.body.email;
        if (otp && email) {
            let verify = await Users.findOne({ email, otp });
            if (verify != null) {
                await Users.updateOne({ email: email }, {
                    $set: {
                        authentic: 1
                    }
                });
                return functions.success(res, 'xác thực thành công')
            }
            return functions.setError(res, 'xác thực thất bại', 404)
        }
        return functions.setError(res, 'thiếu dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm bước 1 của quên mật khẩu
exports.forgotPasswordCheckMail = async(req, res, next) => {
    try {
        let email = req.body.email;
        let checkEmail = await functions.checkEmail(email);
        if (checkEmail) {
            let verify = await Users.findOne({ email: email, type: 1 });
            if (verify != null) {
                // api lẫy mã OTP qua app Chat
                let data = await functions.getDataAxios('http://43.239.223.142:9000/api/users/RegisterMailOtp', { email });
                let otp = data.data.otp
                if (otp) {
                    await Users.updateOne({ email: email }, {
                        $set: {
                            otp: otp
                        }
                    });
                    const token = await functions.createToken(verify, '30m')
                    return functions.success(res, 'xác thực thành công', token)
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
exports.forgotPasswordCheckOTP = async(req, res, next) => {
    try {
        let email = req.user.data.email;
        let otp = req.body.ma_xt;
        if (otp) {
            let verify = await Users.findOne({ email: email, otp: otp, type: 1 });
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
exports.updatePassword = async(req, res, next) => {
    try {
        let email = req.user.data.email,
            password = req.body.password;
        if (password) {
            await Users.updateOne({ email: email, type: 1 }, {
                $set: {
                    password: md5(password)
                }
            });
            return functions.success(res, 'đổi mật khẩu thành công')

        }
        return functions.setError(res, 'thiếu mật khẩu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm cập nhập thông tin công ty
exports.updateInfoCompany = async(req, res, next) => {
    try {
        let email = req.user.data.email
        let request = req.body,
            phone = request.phone,
            userCompany = request.name,
            city = request.city,
            address = request.address,
            site = request.quymo,
            website = request.web,
            description = request.gt,
            mst = request.thue;

        if (phone && userCompany && city && address && description && site) {
            let checkPhone = await functions.checkPhoneNumber(phone)
            if (checkPhone) {
                await Users.updateOne({ email: email, type: 1 }, {
                    $set: {
                        'inForCompany.description': description,
                        'userName': userCompany,
                        'phone': phone,
                        'city': city,
                        'website': website || null,
                        'address': address,
                        'inForCompany.mst': mst || null,
                        'inForCompany.website': website || null,
                        'inForCompany.com_size': site,

                    }
                });
                return functions.success(res, 'update thành công', 404)
            }
            return functions.setError(res, 'sai định dạng số điện thoại', 404)
        }
        return functions.setError(res, 'thiếu dữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm cập nhập thông tin liên hệ 
exports.updateContactInfo = async(req, res, next) => {
    try {
        let email = req.user.data.email
        let userContactName = req.body.name_lh,
            userContactPhone = req.body.phone_lh,
            userContactAddress = req.body.address_lh,
            userContactEmail = req.body.email_lh;

        if (userContactAddress && userContactEmail && userContactName && userContactPhone) {
            let checkPhone = await functions.checkPhoneNumber(userContactPhone);
            let checkEmail = await functions.checkEmail(userContactEmail);

            if (checkEmail && checkPhone) {
                let user = await functions.getDatafindOne(Users, { email: email, type: 1 })

                if (user != null) {
                    await Users.updateOne({ email: email, type: 1 }, {
                        $set: {
                            'inForCompany.userContactName': userContactName,
                            'inForCompany.userContactPhone': userContactPhone,
                            'inForCompany.userContactAddress': userContactAddress,
                            'inForCompany.userContactEmail': userContactEmail,
                        }
                    });
                    return functions.success(res, 'update thành công')
                }
                return functions.setError(res, 'email không tồn tại')
            }
            return functions.setError(res, 'sai định dạng số điện thoại hoặc email')
        }
        return functions.setError(res, 'thiếu dữ liệu')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm cập nhập video hoặc link 
exports.updateVideoOrLink = async(req, res, next) => {
    try {
        let email = req.user.data.email,
            videoType = req.file,
            linkVideo = req.body.linkVideo,
            video = '',
            link = '';
        if (videoType) {
            let checkVideo = await functions.checkVideo(videoType);
            if (checkVideo) {
                video = videoType.filename
            } else {
                await functions.deleteImg(videoType)
                return functions.setError(res, 'video không đúng định dạng hoặc lớn hơn 100MB ', 404)
            }

        }
        if (linkVideo) {
            let checkLink = await functions.checkLink(linkVideo);
            if (checkLink) {
                link = linkVideo;
            } else {
                return functions.setError(res, 'link không đúng định dạng ', 404)
            }
        }
        let user = await functions.getDatafindOne(Users, { email, type: 1 })
        if (user != null) {
            await Users.updateOne({ email: email, type: 1 }, {
                $set: {
                    'inForCompany.videoType': video,
                    'inForCompany.linkVideo': link
                }
            });
            return functions.success(res, 'update thành công')
        }
        await functions.deleteImg(videoType)
        return functions.setError(res, 'email không tồn tại')
    } catch (error) {
        console.log(error)
        await functions.deleteImg(req.file)
        return functions.setError(res, error)
    }
}

// hàm đổi mật khẩu bước 1
exports.changePasswordSendOTP = async(req, res, next) => {
    try {
        let email = req.user.data.email
        let id = req.user.data._id
        let otp = await functions.randomNumber;
        let data = {
            UserID: id,
            SenderID: 1191,
            MessageType: 'text',
            Message: `Chúng tôi nhận được yêu cầu tạo mật khẩu mới tài khoản ứng viên trên timviec365.vn. Mã OTP của bạn là: '${otp}'`
        }
        await functions.getDataAxios('http://43.239.223.142:9000/api/message/SendMessageIdChat', data)
        await Users.updateOne({ email: email, type: 1 }, {
            $set: {
                otp: otp
            }
        });
        return functions.success(res, 'update thành công')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm bước 2  đổi mật khẩu
exports.changePasswordCheckOTP = async(req, res, next) => {
    try {
        let email = req.user.data.email
        let otp = req.body.otp
        if (otp) {
            let verify = await Users.findOne({ email, otp, type: 1 });
            if (verify != null) {
                return functions.success(res, 'xác thực thành công')
            }
            return functions.setError(res, 'mã otp không đúng', 404)
        }
        return functions.setError(res, 'thiếu otp', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm đổi mật khẩu bước 3
exports.changePassword = async(req, res, next) => {
    try {
        let email = req.user.data.email
        let password = req.body.password
        if (password) {
            await Users.updateOne({ email: email, type: 1 }, {
                $set: {
                    password: md5(password),
                }
            });
            return functions.success(res, 'đổi mật khẩu thành công')
        }
        return functions.setError(res, 'thiếu mật khẩu', 404)


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
                await Users.updateOne({ email: email, type: 1 }, {
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

// hàm lấy dữ liệu thông tin cập nhập
exports.getDataCompany = async(req, res, next) => {
    try {
        let id = req.user.data.idTimViec365;
        let user = await functions.getDatafindOne(Users, { idTimViec365: id, type: 1 });
        if (user) {
            return functions.success(res, 'lấy thông tin thành công', user)
        }
        return functions.setError(res, 'người dùng không tồn tại', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm lấy dữ liệu danh sách ứng tuyển UV
exports.listUVApplyJob = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let page = Number(req.body.start);
        let pageSize = Number(req.body.curent);
        if (page && pageSize) {

            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let findUV = await functions.pageFind(ApplyForJob, { userID: idCompany, type: 1 }, { _id: -1 }, skip, limit);
            const totalCount = await functions.findCount(ApplyForJob, { userID: idCompany, type: 1 });
            const totalPages = Math.ceil(totalCount / pageSize);
            if (findUV) {
                return functions.success(res, "Lấy danh sách uv thành công", { totalCount, totalPages, listUv: findUV });
            }
        } else {
            let findUV = await functions.getDatafind(ApplyForJob, { userID: idCompany, type: 1 });
            return functions.success(res, "Lấy danh sách uv thành công", findUV);
        }
        return functions.setError(res, 'không lấy được danh sách', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }

}

// hàm lấy dữ liệu danh sách ứng tuyển của chuyên viên gửi
exports.listUVApplyJobStaff = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let page = Number(req.body.start);
        let pageSize = Number(req.body.curent);
        if (page && pageSize) {
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let findUV = await functions.pageFind(ApplyForJob, { userID: idCompany, type: 2 }, { _id: -1 }, skip, limit);
            const totalCount = await functions.findCount(ApplyForJob, { userID: idCompany, type: 2 });
            const totalPages = Math.ceil(totalCount / pageSize);
            if (findUV) {
                return functions.success(res, "Lấy danh sách uv thành công", { totalCount, totalPages, listUv: findUV });
            }
            return functions.setError(res, 'không lấy được danh sách', 404)
        } else {
            let findUV = await functions.getDatafind(ApplyForJob, { userID: idCompany, type: 2 });
            return functions.success(res, "Lấy danh sách uv thành công", findUV);
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }

}

// hàm thống kê tin đăng
exports.postStatistics = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        const now = new Date();
        let startOfDay = (new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0));
        let endOfDay = (new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999));
        let threeDaysTomorow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
        // count UV ứng tuyển
        let countApplyForJobTypeOne = await functions.findCount(ApplyForJob, { userID: idCompany, type: 1 });
        // count cọng tác viên gửi Uv
        let countApplyForJobTypeTwo = await functions.findCount(ApplyForJob, { userID: idCompany, type: 2 });
        // count việc còn hạn
        let countAvailableJobs = await functions.findCount(NewTV365, { userID: idCompany, hanNop: { $gt: now } });
        // count việc hết hạn
        let countGetExpiredJobs = await functions.findCount(NewTV365, { userID: idCompany, hanNop: { $lt: now } });
        // count tin đã đăng trong ngày
        let countPostsInDay = await functions.findCount(NewTV365, { userID: idCompany, createTime: { $gte: startOfDay, $lte: endOfDay } });
        // count tin đã cập nhập trong ngày
        let countRefreshPostInDay = await functions.findCount(NewTV365, { userID: idCompany, updateTime: { $gte: startOfDay, $lte: endOfDay } });
        // count tin gần hết hạn 
        let countJobsNearExpiration = await functions.findCount(NewTV365, { userID: idCompany, hanNop: { $lte: threeDaysTomorow, $gte: now } });
        let count = {
            count_uv_ung_tuyen: countApplyForJobTypeOne,
            count_ctv_gui_uv: countApplyForJobTypeTwo,
            count_tin_dang_con_han: countAvailableJobs,
            count_tin_dang_het_han: countGetExpiredJobs,
            count_tin_dang_trong_ngay: countPostsInDay,
            count_tin_cap_nhap_trong_ngay: countRefreshPostInDay,
            count_tin_sap_het_han: countJobsNearExpiration,
        }
        return functions.success(res, "lấy số lượng thành công", count)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm lấy danh sách các ứng viên đã lưu
exports.listSaveUV = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let page = Number(req.body.start);
        let pageSize = Number(req.body.curent);
        if (page && pageSize) {
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let findUV = await functions.pageFind(SaveCandidate, { uscID: idCompany }, { _id: -1 }, skip, limit);
            const totalCount = await functions.findCount(SaveCandidate, { uscID: idCompany });
            const totalPages = Math.ceil(totalCount / pageSize);
            if (findUV) {
                return functions.success(res, "Lấy danh sách uv thành công", { totalCount, totalPages, listUv: findUV });
            }
            return functions.setError(res, 'không lấy được danh sách', 404)
        } else {
            let findUV = await functions.getDatafind(SaveCandidate, { uscID: idCompany });
            return functions.success(res, "Lấy danh sách tất cả uv thành công", findUV);
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm quản lý điểm
exports.manageFilterPoint = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let point = await functions.getDatafindOne(PointCompany, { uscID: idCompany, type: 1 });
        let now = new Date();
        let pointUSC = 0;
        if (point) {
            let checkReset0 = await functions.getDatafindOne(PointCompany, { uscID: idCompany, type: 1, dayResetPoint0: { $lt: now } });
            if (checkReset0 == null) {
                pointUSC = point.pointUSC
            }
            return functions.success(res, "lấy số lượng thành công", {
                pointFree: 0,
                pointUSC: pointUSC,
                totalPoint: pointUSC,
            })
        }
        return functions.setError(res, 'không có dữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm xem ứng hồ sơ ứng viên với điểm lọc 
exports.seenUVWithPoint = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let idUser = req.body.useID;
        let noteUV = req.body.noteUV;
        let ipUser = req.body.ipUser;
        let returnPoint = req.body.returnPoint;
        let point = 0;
        if (idUser && ipUser) {
            let companyPoint = await functions.getDatafindOne(PointCompany, { uscID: idCompany });
            if (companyPoint) {
                point = companyPoint.pointUSC - 1;
                if (point >= 0 && companyPoint.pointUSC > 0) {
                    await PointCompany.updateOne({ uscID: idCompany }, {
                        $set: {
                            pointUSC: point,
                        }
                    });
                    let maxID = await functions.getMaxID(PointUsed) || 0;
                    const pointUsed = new PointUsed({
                        _id: Number(maxID) + 1,
                        uscID: idCompany,
                        useID: idUser,
                        point: 1,
                        type: 1,
                        noteUV: noteUV || " ",
                        usedDay: new Date().getTime(),
                        returnPoint: returnPoint || 0,
                        ipUser: ipUser
                    })
                    await pointUsed.save();
                    return functions.success(res, "Xem thành công")
                }
                return functions.success(res, "Điểm còn lại là 0", {
                    point: 0
                })
            }
            return functions.setError(res, 'nhà tuyển dụng không có điểm', 404)
        }
        return functions.setError(res, 'không có dữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm đánh giá của NTD về CTV
exports.submitFeedbackCtv = async(req, res, next) => {
    try {
        let request = req.body,
            idCompany = req.user.data.idTimViec365,
            description = req.user.data.inForCompany.description;
        if (request) {
            let company = await functions.getDatafindOne(UserCompanyMultit, { uscID: idCompany });
            if (company) {
                await UserCompanyMultit.updateOne({ uscID: idCompany }, {
                    $set: {
                        dgc: request,
                        dgTime: new Date().getTime(),
                    }
                });
                return functions.success(res, "Cập nhập thành công")
            } else {
                let maxID = await functions.getMaxID(UserCompanyMultit) || 0;
                const feedBack = new UserCompanyMultit({
                    _id: maxID,
                    uscID: idCompany,
                    companyInfo: description,
                    dgc: request,
                    dgTime: new Date().getTime(),
                });
                await feedBack.save();
                return functions.success(res, "tạo thành công")
            }
        }
        return functions.setError(res, 'không có dữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm đánh giá của NTD về Web
exports.submitFeedbackWeb = async(req, res, next) => {
    try {
        let request = req.body,
            idCompany = req.user.data.idTimViec365,
            description = req.user.data.inForCompany.description;
        if (request) {
            let company = await functions.getDatafindOne(UserCompanyMultit, { uscID: idCompany });
            if (company) {
                await UserCompanyMultit.updateOne({ uscID: idCompany }, {
                    $set: {
                        dgtv: request,
                        dgTime: new Date().getTime(),
                    }
                });
                return functions.success(res, "Cập nhập thành công")
            } else {
                let maxID = await functions.getMaxID(UserCompanyMultit) || 0;
                const feedBack = new UserCompanyMultit({
                    _id: maxID,
                    uscID: idCompany,
                    companyInfo: description,
                    dgtv: request,
                    dgTime: new Date().getTime(),
                });
                await feedBack.save();
                return functions.success(res, "tạo thành công")

            }
        }
        return functions.setError(res, 'không có dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm lấy ra kho ảnh
exports.displayImages = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let khoAnh = await functions.getDatafindOne(Users, { idTimViec365: idCompany, type: 1 });
        if (khoAnh) {
            let data = {
                listImgs: khoAnh.inForCompany.comImages,
                listVideos: khoAnh.inForCompany.comVideos,
            }
            return functions.success(res, "lấy dữ liệu thành công thành công", data)
        }
        return functions.setError(res, 'không có dữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm up ảnh ở kho ảnh
exports.uploadImg = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let img = req.files;
        let imageMoment = 0;
        let sizeImg = 0;
        let user = await functions.getDatafindOne(Users, { idTimViec365: idCompany, type: 1 });
        if (user) {
            let listImg = user.inForCompany.comImages;
            let listVideo = user.inForCompany.comVideos;
            const listMedia = [...listImg, ...listVideo];
            for (let i = 0; i < listMedia.length; i++) {
                imageMoment += listMedia[i].size;
            }
            if (imageMoment < functions.MAX_Kho_Anh) {
                if (img) {
                    for (let i = 0; i < img.length; i++) {
                        sizeImg += img[i].size;
                    }
                    if ((Number(sizeImg) + Number(imageMoment)) <= functions.MAX_Kho_Anh) {
                        for (let i = 0; i < img.length; i++) {
                            let checkImg = await functions.checkImage(img[i].path);
                            if (checkImg) {
                                let id = listImg[listImg.length - 1] || 0;
                                let newID = id._id || 0;
                                listImg.push({
                                    _id: Number(newID) + 1,
                                    name: img[i].filename,
                                    size: img[i].size,
                                    active: 0,
                                    type: 1
                                })
                            } else {
                                if (img) {
                                    for (let i = 0; i < img.length; i++) {
                                        await functions.deleteImg(img[i])
                                    }
                                }
                                return functions.setError(res, 'sai định dạng ảnh hoặc ảnh lớn hơn 2MB', 404)
                            }
                        }
                        await Users.updateOne({ idTimViec365: idCompany, type: 1 }, {
                            $set: { 'inForCompany.comImages': listImg }
                        });
                        return functions.success(res, 'thêm ảnh thành công')

                    } else {
                        if (img) {
                            for (let i = 0; i < img.length; i++) {
                                await functions.deleteImg(img[i])
                            }
                        }
                        return functions.setError(res, 'ảnh thêm vào đã quá dung lượng của kho', 404)
                    }
                } else {
                    if (img) {
                        for (let i = 0; i < img.length; i++) {
                            await functions.deleteImg(img[i])
                        }
                    }
                    return functions.setError(res, 'chưa có ảnh', 404)
                }
            }
            if (img) {
                for (let i = 0; i < img.length; i++) {
                    await functions.deleteImg(img[i])
                }
            }
            return functions.setError(res, ' kho ảnh đã đầy', 404)
        }
        if (img) {
            for (let i = 0; i < img.length; i++) {
                await functions.deleteImg(img[i])
            }
        }
        return functions.setError(res, 'nguời dùng không tồn tại', 404)
    } catch (error) {
        console.log(error)
        if (img) {
            for (let i = 0; i < img.length; i++) {
                await functions.deleteImg(img[i])
            }
        }
        return functions.setError(res, error)
    }
}

// hàm up video ở kho ảnh
exports.uploadVideo = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let video = req.files;
        let imageMoment = 0;
        let sizeVideo = 0;
        let user = await functions.getDatafindOne(Users, { idTimViec365: idCompany, type: 1 });
        if (user) {
            let listImg = user.inForCompany.comImages;
            let listVideo = user.inForCompany.comVideos;
            const listMedia = [...listImg, ...listVideo];
            console.log(listMedia)
            for (let i = 0; i < listMedia.length; i++) {
                imageMoment += listMedia[i].size;
            }

            if (imageMoment < functions.MAX_Kho_Anh) {
                if (video) {
                    for (let i = 0; i < video.length; i++) {
                        sizeVideo += video[i].size;
                    }
                    if ((Number(sizeVideo) + Number(imageMoment)) <= functions.MAX_Kho_Anh) {
                        for (let i = 0; i < video.length; i++) {
                            let checkImg = await functions.checkVideo(video[i]);
                            if (checkImg) {
                                let id = listVideo[listVideo.length - 1] || 0;
                                let newID = id._id || 0;
                                listVideo.push({
                                    _id: Number(newID) + 1,
                                    name: video[i].filename,
                                    size: video[i].size,
                                    active: 0,
                                    type: 1
                                })

                            } else {
                                if (video) {
                                    for (let i = 0; i < video.length; i++) {
                                        await functions.deleteImg(video[i])
                                    }
                                }
                                return functions.setError(res, 'sai định dạng video hoặc video lớn hơn 100MB', 404)
                            }
                        }
                        await Users.updateOne({ idTimViec365: idCompany, type: 1 }, {
                            $set: { 'inForCompany.comVideos': listVideo }
                        });
                        return functions.success(res, 'thêm video thành công')
                    } else {
                        if (video) {
                            for (let i = 0; i < video.length; i++) {
                                await functions.deleteImg(video[i])
                            }
                        }
                        return functions.setError(res, 'video thêm vào đã quá dung lượng của kho', 404)
                    }
                } else {
                    if (video) {
                        for (let i = 0; i < video.length; i++) {
                            await functions.deleteImg(video[i])
                        }
                    }
                    return functions.setError(res, 'chưa có video', 404)
                }
            }
            if (video) {
                for (let i = 0; i < video.length; i++) {
                    await functions.deleteImg(video[i])
                }
            }
            return functions.setError(res, 'kho ảnh đã đầy', 404)
        }
        if (video) {
            for (let i = 0; i < video.length; i++) {
                await functions.deleteImg(video[i])
            }
        }
        return functions.setError(res, 'nguời dùng không tồn tại', 404)
    } catch (error) {
        console.log(error)
        if (video) {
            for (let i = 0; i < video.length; i++) {
                await functions.deleteImg(video[i])
            }
        }
        return functions.setError(res, error)
    }
}

// hàm xóa ảnh
exports.deleteImg = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let idFile = req.body.idFile;
        let user = await functions.getDatafindOne(Users, { idTimViec365: idCompany, type: 1 });
        if (idFile && user) {
            let listImg = user.inForCompany.comImages;
            const index = listImg.findIndex(img => img._id == idFile);
            if (index != -1) {
                let nameFile = listImg[index].name;
                await listImg.splice(index, 1);
                await Users.updateOne({ idTimViec365: idCompany, type: 1 }, {
                    $set: { 'inForCompany.comImages': listImg }
                });
                await functions.deleteImg(`public\\KhoAnh\\${idCompany}\\${nameFile}`)
                return functions.success(res, 'xoá thành công')
            } else {
                return functions.setError(res, 'id không đúng', 404)
            }

        }
        return functions.setError(res, 'tên file không tồn tại hoặc người dùng không tồn tại', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm xóa video
exports.deleteVideo = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let idFile = req.body.idFile;
        let user = await functions.getDatafindOne(Users, { idTimViec365: idCompany, type: 1 });
        if (idFile && user) {
            let listVideo = user.inForCompany.comVideos;
            const index = listVideo.findIndex(video => video._id == idFile);
            if (index != -1) {
                await listVideo.splice(index, 1);
                let nameFile = listVideo[index].name;
                await Users.updateOne({ idTimViec365: idCompany, type: 1 }, {
                    $set: { 'inForCompany.comVideos': listVideo }
                });
                await functions.deleteImg(`public\\KhoAnh\\${idCompany}\\${nameFile}`)
                return functions.success(res, 'xoá thành công')
            } else {
                return functions.setError(res, 'id không đúng', 404)
            }
        }
        return functions.setError(res, 'tên file không tồn tại hoặc người dùng không tồn tại', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm gọi data lĩnh vực
exports.getDataLV = async(req, res, next) => {
    try {
        let lists = await CategoryCompany.find({}, { _id: 1, nameTag: 1 });
        return functions.success(res, 'lấy thành công', { lists })
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
};

// hàm tìm lĩnh vực theo ngành nghề
exports.getFieldsByIndustry = async(req, res, next) => {
    try {
        let catID = req.body.cat_id;
        if (catID) {
            let data = await functions.getDatafind(CategoryCompany, { tagIndex: catID })
            return functions.success(res, 'lấy thành công', { data })
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// lưu ứng viên 
exports.luuUV = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let idUser = req.body.user_id;
        if (idUser) {
            let maxID = await functions.getMaxID(SaveCandidate) || 0;
            let newID = maxID._id || 0;
            const uv = new SaveCandidate({
                _id: Number(newID) + 1,
                uscID: idCompany,
                userID: idUser,
                saveTime: new Date().getTime()
            })
            await uv.save();
            return functions.success(res, 'lưu thành công', )
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// xóa ứng viên trong danh sách lưu
exports.deleteUV = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let idUser = req.body.user_id;
        if (idUser) {
            await functions.getDataDeleteOne(SaveCandidate, { uscID: idCompany, userID: idUser })
            return functions.success(res, 'xóa thành công', )
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// danh sách sử dụng điểm của nhà tuyển dụng cho Uv
exports.listUVPoin = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let page = Number(req.body.start);
        let pageSize = Number(req.body.curent);
        if (page && pageSize) {
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let findUV = await functions.pageFind(PointUsed, { uscID: idCompany }, { _id: -1 }, skip, limit);
            const totalCount = await functions.findCount(PointUsed, { uscID: idCompany });
            const totalPages = Math.ceil(totalCount / pageSize);
            if (findUV) {
                return functions.success(res, "Lấy danh sách uv thành công", { total: totalCount, items: findUV });
            }
            return functions.setError(res, 'không lấy được danh sách', 404)
        } else {
            let findUV = await functions.getDatafind(SaveCandidate, { uscID: idCompany });
            return functions.success(res, "Lấy danh sách tất cả uv thành công", findUV);
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// xóa uv trong danh sách dùng điểm
exports.deleteUVUsePoin = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let idUser = req.body.user_id;
        if (idUser) {
            await functions.getDataDeleteOne(PointUsed, { uscID: idCompany, userID: idUser })
            return functions.success(res, 'xóa thành công', )
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm cập nhập ứng viên ứng tuyển 
exports.updateUvApplyJob = async(req, res, next) => {
    try {
        let newID = req.body.new_id;
        let userID = req.body.user_id;
        let type = req.body.type;
        if (newID && userID && type) {
            let news = await functions.getDatafindOne(NewTV365, { _id: newID });
            let user = await functions.getDatafindOne(Users, { idTimViec365: userID, type: 1 });
            if (news && user) {
                await ApplyForJob.updateOne({ userID: userID, newID: newID }, {
                    $set: { kq: type }
                });
                return functions.success(res, 'cập nhập thành công', )
            }
            return functions.setError(res, 'người dùng hoặc bài viết không tồn tại', 404)
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm cập nhập ứng viên qua điểm lọc
exports.updateUvWithPoint = async(req, res, next) => {
    try {
        let userID = req.body.user_id;
        let type = req.body.type;
        let note = req.body.note;
        if (userID) {
            let poin = await functions.getDatafindOne(PointUsed, { uscID: idCompany, useID: idUV });
            if (poin) {
                await PointUsed.updateOne({ uscID: idCompany, useID: idUV }, {
                    $set: {
                        type: type,
                        noteUV: note,
                    }
                });
                return functions.success(res, 'cập nhập thành công', )
            }
            return functions.setError(res, 'không tồn tại người dùng trong danh sách điểm lọc', 404)
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm chi tiết công ty trước đăng nhập
exports.getDetailInfoCompany = async(req, res, next) => {
    try {
        let idCompany = req.body.user_id;
        if (idCompany) {
            let company = await functions.getDatafindOne(Users, { idTimViec365: idCompany, type: 1 });
            if (company) {
                let listNew = await functions.getDatafind(NewTV365, { userID: idCompany })
                return functions.success(res, 'xem chi tiết thành công', { inForCompany: company, listNew })
            }
            return functions.setError(res, 'công ty không tồn tại', 404)
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm box mẫu cv
exports.formCV = async(req, res, next) => {
    try {
        let formCV = await CV.find().sort({ _id: -1 }).limit(10);
        return functions.success(res, 'lấy thành công', { formCV })

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm đánh giá ứng viên 
exports.assessmentUV = async(req, res, next) => {
    try {
        let idUV = req.body.user_id;
        let idCompany = req.user.data.idTimViec365;
        let type = req.body.type;
        let note = req.body.note;
        if (idCompany) {
            let poin = await functions.getDatafindOne(PointUsed, { uscID: 425711, useID: idUV });
            if (poin) {
                await PointUsed.updateOne({ uscID: 425711, useID: idUV }, {
                    $set: {
                        type: type,
                        noteUV: note,
                    }
                });
                return functions.success(res, 'cập nhập thành công', )
            }
            return functions.setError(res, 'chưa xem chi tiết ứng viên', 404)
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}