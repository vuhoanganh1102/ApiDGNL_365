const Users = require('../../models/Users');
const blog = require('../../models/Timviec365/Blog/Posts');
const Profile = require('../../models/Timviec365/UserOnSite/Candicate/Profile');
const SaveCvCandi = require('../../models/Timviec365/UserOnSite/Candicate/SaveCvCandi'); // Cv đã lưu
const SaveAppli = require('../../models/Timviec365/CV/ApplicationUV'); // Đơn đã lưu
const HoSoUV = require('../../models/Timviec365/CV/ResumeUV'); // Sơ yếu lý lịch đã lưu
const LetterUV = require('../../models/Timviec365/CV/LetterUV'); // Thư xin việc đã lưu
const CV = require('../../models/Timviec365/CV/Cv365');
const Application = require('../../models/Timviec365/CV/Application');
const Letter = require('../../models/Timviec365/CV/Letter');
const Cv365Category = require('../../models/Timviec365/CV/Category');
const like = require('../../models/Timviec365/CV/Like');
const userUnset = require('../../models/Timviec365/UserOnSite/Candicate/UserUnset');
const newTV365 = require('../../models/Timviec365/UserOnSite/Company/New');
const applyForJob = require('../../models/Timviec365/UserOnSite/Candicate/ApplyForJob');
const userSavePost = require('../../models/Timviec365/UserOnSite/Candicate/UserSavePost');
const pointUsed = require('../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointUsed');
const CommentPost = require('../../models/Timviec365/UserOnSite/CommentPost');
const PermissionNotify = require('../../models/Timviec365/PermissionNotify');
const Notification = require('../../models/Timviec365/Notification');
const TblModules = require("../../models/Timviec365/TblModules");
const SaveCandidate = require('../../models/Timviec365/UserOnSite/Company/SaveCandidate');
const Evaluate = require('../../models/Timviec365/Evaluate');
const TagBlog = require('../../models/Timviec365/Blog/TagBlog');
const KeyWord = require('../../models/Timviec365/UserOnSite/Company/Keywords');
const Category = require('../../models/Timviec365/CategoryJob');

//mã hóa mật khẩu
const md5 = require('md5');
//token
var jwt = require('jsonwebtoken');
const axios = require('axios');
const functions = require('../../services/functions');
const functionsBlog = require('../../services/serviceBlog');
const service = require('../../services/timviec365/candidate');
const serviceCv365 = require('../../services/timviec365/cv');
const serviceNew365 = require('../../services/timviec365/new');
const servicePermissionNotify = require('../../services/timviec365/PermissionNotify');

const { token } = require('morgan');
const fs = require('fs');
const path = require('path');


exports.checkAccountExist = async(req, res, next) => {
    try {
        const account = req.body.account;
        if (account) {
            const check = await Users.findOne({
                phoneTK: account,
                type: 0
            });
            if (!check) {
                return functions.success(res, "Tài khoản hợp lệ");
            }
            return functions.setError(res, "Tài khoản đã được đăng ký");
        }
        return functions.setError(res, "Chưa truyền tham số check tài khoản");
    } catch (error) {
        console.log("Đã có lỗi xảy ra", error);
        return functions.setError(res, "Đã có lỗi xảy ra");
    }
}

//đăng kí ứng viên B1
exports.RegisterB1 = async(req, res, next) => {
    try {
        let requestBody = req.body,
            phoneTK = requestBody.phoneTK;

        if (phoneTK && await functions.checkPhoneNumber(phoneTK)) {
            // Kiểm tra SĐT đã được đăng ký tài khoản ứng viên hay chưa
            let checkUser = await functions.getDatafindOne(Users, { phoneTK, type: { $ne: 1 } });
            if (!checkUser) {
                // Lấy các tham số của ứng viên
                let phoneTK = requestBody.phoneTK || "",
                    password = requestBody.password || null,
                    userName = requestBody.userName || null,
                    email = requestBody.email || null,
                    city = requestBody.city || null,
                    district = requestBody.district || null,
                    address = requestBody.address || null,
                    candiCateID = requestBody.candiCateID || null,
                    candiCityID = requestBody.candiCityID || null,
                    candiTitle = requestBody.candiTitle || null,
                    uRegis = requestBody.uRegis || 0,
                    fromWeb = requestBody.fromWeb || 'timviec365';

                // Kiểm tra có phải là email hay không?
                // if (!await functions.checkEmail(email)) {
                //     email = null;
                // }
                // && city && password && district  && candiCateID && candiCityID 
                if ((phoneTK) != null) {
                    // Check xem ứng viên đã đăng ký mà chưa hoàn thiện hồ sơ chưa
                    let findUserUv = await functions.getDatafindOne(userUnset, { usePhoneTk: phoneTK }),
                        // Tạo data
                        data = {
                            usePhoneTk: phoneTK,
                            usePass: md5(password),
                            useFirstName: userName,
                            useMail: email,
                            useCity: city,
                            useQh: district,
                            useAddr: address,
                            uRegis: uRegis,
                            useCvCate: candiCateID,
                            useCvCity: candiCityID,
                            useCvTitle: candiTitle,
                            usePhone: phoneTK,
                            useCreateTime: new Date(Date.now()),
                            useLink: "",
                            useActive: 0,
                            useDelete: 0,
                            type: 0,
                        };

                    // Nếu chưa thì đăng ký mới
                    if (!findUserUv) {
                        let maxUserUnset = await userUnset.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean() || 0;
                        if (maxUserUnset) {
                            newID = Number(maxUserUnset._id) + 1;
                        } else newID = 1;
                        requestBody._id = newID;
                        data._id = newID;
                        let UserUV = new userUnset(data)
                        await UserUV.save();
                    } else {
                        requestBody._id = findUserUv._id;
                        await functions.getDatafindOneAndUpdate(userUnset, { usePhoneTk: phoneTK }, data)
                    }
                    requestBody.password = data.usePass;
                    requestBody.fromWeb = fromWeb;
                    requestBody.createdAt = functions.getTimeNow();

                    const token = await functions.createToken(requestBody, "1d");
                    return functions.success(res, 'Đăng ký bước 1 thành công', { user_info: requestBody._id, token })
                } else {
                    return functions.setError(res, "Thiếu tham số đầu vào");
                }
            } else {
                return functions.setError(res, "Tài khoản đã được đăng ký");
            }
        } else {
            return functions.setError(res, "Số điện thoại không được trống");
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi đăng kí B1", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//đăng kí ứng viên B2 bằng video (tạm thời bỏ)
exports.RegisterB2VideoUpload = async(req, res, next) => {
    try {
        if (req && req.body && req.file) {
            const videoUpload = req.file
            const videoLink = req.body.videoLink
            const phoneTK = req.user.data.phoneTK
            const password = req.user.data.password
            const userName = req.user.data.userName
            const email = req.user.data.email
            const city = req.user.data.city
            const district = req.user.data.district
            const address = req.user.data.address
            const from = req.user.data.uRegis
            const candiCateID = req.user.data.candiCateID
            const candiCityID = req.user.data.candiCityID
            const candiTitle = req.user.data.candiTitle
            const type = req.user.data.type

            let findUser = await functions.getDatafindOne(Users, { phoneTK, type: { $ne: 1 } })
            if (findUser && findUser.phoneTK && findUser.phoneTK == phoneTK) { // check tồn tại tài khoản chưa
                return functions.setError(res, "Số điện thoại này đã được đăng kí", 200);
            } else {
                const maxID = await Users.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                if (maxID) {
                    newID = Number(maxID._id) + 1;
                }
                const maxIDTimviec = await Users.findOne({}, { idTimViec365: 1 }).sort({ idTimViec365: -1 }).lean();
                if (maxIDTimviec) {
                    newIDTimviec = Number(maxIDTimviec.idTimViec365) + 1;
                }
                if (videoUpload && !videoLink) { // check video tải lên là file video
                    let User = new Users({
                        _id: newID,
                        phoneTK: phoneTK,
                        password: password,
                        userName: userName,
                        type: 0,
                        emailContact: email,
                        city: city,
                        district: district,
                        address: address,
                        from: from,
                        idTimViec365: newIDTimviec,
                        authentic: 0,
                        createdAt: functions.getTimeNow(),
                        inForPerson: {
                            user_id: 0,
                            candiCateID: candiCateID,
                            candiCityID: candiCityID,
                            candiTitle: candiTitle,
                            video: videoUpload.filename,
                            videoType: 1,
                            videoActive: 1
                        }
                    })
                    let saveUser = User.save()
                }
                if (videoLink && !videoUpload) { //check video upload là link
                    let User = new Users({
                        _id: newID,
                        phoneTK: phoneTK,
                        password: password,
                        userName: userName,
                        type: 0,
                        emailContact: email,
                        city: city,
                        district: district,
                        address: address,
                        from: from,
                        idTimViec365: newIDTimviec,
                        authentic: 0,
                        createdAt: new Date(Date.now()),
                        inForPerson: {
                            user_id: 0,
                            candiCateID: candiCateID,
                            candiCityID: candiCityID,
                            candiTitle: candiTitle,
                            video: videoLink,
                            videoType: 2,
                            videoActive: 1
                        }
                    })
                    let saveUser = User.save()
                }
                let deleteUser = userUnset.findOneAndDelete({ usePhoneTk: phoneTK, type: 0 })
                return functions.success(res, "Đăng kí thành công")
            }
        } else return functions.setError(res, "Thông tin truyền lên không đầy đủ", 200);
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi đăng kí", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 200)
    }
}

//đăng kí ứng viên bước 2 bằng cách upload cv
exports.RegisterB2CvUpload = async(req, res, next) => {
    try {
        if (req && req.body) {
            // Nhận dữ liệu từ formData
            const birthday = req.body.birthday;
            const experience = req.body.experience;
            const school = req.body.school;
            const rate = req.body.rate;
            const fileUpload = req.files;
            const videoLink = req.body.videoLink;
            let listPermissions = req.body.listPermissions;

            // Nhận dữ liệu từ token
            const phoneTK = req.user.data.phoneTK;
            const password = req.user.data.password;
            const userName = req.user.data.userName;
            const email = req.user.data.email;
            const city = req.user.data.city;
            const district = req.user.data.district;
            const address = req.user.data.address;
            const fromDevice = req.user.data.uRegis;
            const fromWeb = req.user.data.fromWeb;

            const cv_cate_id = req.user.data.candiCateID.split(",").map(Number);
            const cv_city_id = req.user.data.candiCityID.split(",").map(Number);
            const cv_title = req.user.data.candiTitle;
            const type = req.user.data.type;

            // Khai báo biến
            let cvUpload, videoUpload;

            if (fileUpload) {
                if (fileUpload.cvUpload) {
                    cvUpload = fileUpload.cvUpload;
                }
                if (fileUpload.videoUpload) {
                    videoUpload = fileUpload.videoUpload;
                    if (videoUpload.size > (100 * 1024 * 1024)) {
                        return functions.setError(res, "dung lượng file vượt quá 100MB", 200)
                    }
                }

                // check tồn tại tài khoản chưa
                let findUser = await functions.getDatafindOne(Users, { phoneTK: phoneTK, type: { $ne: 1 } })
                if (findUser && findUser.phoneTK && findUser.phoneTK == phoneTK) {
                    return functions.setError(res, "Số điện thoại này đã được đăng kí", 200);
                } else {
                    // Lấy id mới nhất
                    const getMaxUserID = await functions.getMaxUserID();
                    const videoType = !videoLink ? 1 : 2;
                    const now = functions.getTimeNow();

                    let data = {
                        _id: getMaxUserID._id,
                        phoneTK: phoneTK,
                        password: password,
                        userName: userName,
                        phone: phoneTK,
                        type: 0,
                        emailContact: email,
                        city: city,
                        district: district,
                        address: address,
                        fromWeb: fromWeb,
                        fromDevice: fromDevice,
                        createdAt: now,
                        updatedAt: now,
                        idTimViec365: getMaxUserID._idTV365,
                        idRaoNhanh365: getMaxUserID._idRN365,
                        idQLC: getMaxUserID._idQLC,
                        chat365_secret: Buffer.from(getMaxUserID._id.toString()).toString('base64'),
                        inForPerson: {
                            account: {
                                birthday: birthday,
                                experience: experience,
                            },
                            candidate: {
                                cv_cate_id: cv_cate_id,
                                cv_city_id: cv_city_id,
                                cv_video_type: videoType,
                                cv_title: cv_title,
                                profileDegree: [{
                                    th_id: 1,
                                    th_name: school,
                                    th_xl: rate
                                }]
                            }
                        }
                    };

                    // 
                    let dataUpload = {};

                    // Nếu ứng viên hoàn thiện hồ sơ bằng cách tải video
                    if (videoUpload && !videoLink && !cvUpload) {
                        data.inForPerson.candidate.cv_video = videoUpload[0].filename;
                    }
                    // Nếu ứng viên hoàn thiện hồ sơ bằng cách tải video dạng link
                    if (videoLink && !videoUpload && !cvUpload) {
                        data.inForPerson.candidate.cv_video = videoLink;
                    }
                    // Nếu ứng viên hoàn thiện hồ sơ bằng cách tải hồ sơ dạng ảnh pdf, png,..
                    if (!videoUpload && !videoLink && cvUpload) {
                        dataUpload = {
                            hs_use_id: getMaxUserID._idTV365,
                            hs_name: cvUpload[0].originalname,
                            hs_link: cvUpload[0].filename,
                            hs_create_time: now
                        };
                    }
                    // Nếu ứng viên hoàn thiện hồ sơ bằng cách tải hồ sơ dạng ảnh pdf, png,.. và tải kèm video dạng file.
                    if (videoUpload && !videoLink && cvUpload) {
                        dataUpload = {
                            hs_use_id: getMaxUserID._idTV365,
                            hs_name: cvUpload[0].originalname,
                            hs_link: cvUpload[0].filename,
                            hs_create_time: now
                        };
                        data.inForPerson.candidate.cv_video = videoUpload[0].filename;
                    }
                    // Nếu ứng viên hoàn thiện hồ sơ bằng cách tải hồ sơ dạng ảnh pdf, png,.. và tải kèm video dạng link.
                    if (!videoUpload && videoLink && cvUpload) {
                        dataUpload = {
                            hs_use_id: getMaxUserID._idTV365,
                            hs_name: cvUpload[0].originalname,
                            hs_link: cvUpload[0].filename,
                            hs_create_time: dateNowInt
                        };
                        data.inForPerson.candidate.cv_video = videoLink;
                    }

                    // Lưu lại thông tin ứng viên
                    let User = new Users(data);
                    await User.save();
                    await userUnset.findOneAndDelete({ usePhoneTk: phoneTK });

                    // Lưu lại thông tin tải file
                    if (dataUpload) {
                        const getMaxIdProfile = await Profile.findOne({}, { hs_id: 1 }).sort({ hs_id: -1 }).limit(1).lean();
                        dataUpload.hs_id = getMaxIdProfile.hs_id + 1;
                        const profile = new Profile(dataUpload);
                        await profile.save();
                    }

                    // Lưu lại thông tin phân quyền
                    servicePermissionNotify.HandlePermissionNotify(getMaxUserID._idTV365, listPermissions);
                    const token = await functions.createToken({
                        _id: getMaxUserID._id,
                        idTimViec365: getMaxUserID._idTV365,
                        idQLC: getMaxUserID._idQLC,
                        idRaoNhanh365: getMaxUserID._idRN365,
                        email: email,
                        phoneTK: getMaxUserID.phoneTK,
                        createdAt: now,
                        type: 0,
                        com_id: 0
                    }, "1d");

                    return functions.success(res, "Đăng kí thành công", {
                        access_token: token,
                        chat365_id: getMaxUserID._id,
                        user_id: data.idTimViec365
                    })
                }
            }
            return functions.setError(res, "Chưa tải cv hoặc video hoàn thiện hồ sơ", 200)

        } else return functions.setError(res, "Thông tin truyền lên không đầy đủ", 200);
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi đăng kí", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 200)
    }


}

//đăng kí = cách làm cv trên site
exports.RegisterB2CvSite = async(req, res, next) => {
    try {
        if (req.user) {
            const userData = req.user.data;
            const phoneTK = userData.phoneTK;
            const password = userData.password;
            const userName = userData.userName;
            const email = userData.email;
            const phone = userData.phone;
            const city = userData.city;
            const district = userData.district;
            const address = userData.address;
            const fromDevice = userData.uRegis;
            const fromWeb = userData.fromWeb;
            const cv_cate_id = userData.candiCateID.split(",").map(Number);
            const cv_city_id = userData.candiCityID.split(",").map(Number);
            const cv_title = userData.candiTitle;
            const type = userData.type;

            let findUser = await functions.getDatafindOne(Users, { phoneTK: phoneTK, type: { $ne: 1 } })
            if (findUser && findUser.phoneTK && findUser.phoneTK == phoneTK) {
                return functions.setError(res, "Số điện thoại này đã được đăng kí", 200);
            }

            // Lấy id mới nhất
            const getMaxUserID = await functions.getMaxUserID();
            const now = functions.getTimeNow();
            let data = {
                _id: getMaxUserID._id,
                phoneTK: phoneTK,
                password: password,
                userName: userName,
                phone: phoneTK,
                type: 0,
                emailContact: phone,
                city: city,
                district: district,
                address: address,
                fromWeb: fromWeb,
                fromDevice: fromDevice,
                idTimViec365: getMaxUserID._idTV365,
                idRaoNhanh365: getMaxUserID._idRN365,
                idQLC: getMaxUserID._idQLC,
                chat365_secret: Buffer.from(getMaxUserID._id.toString()).toString('base64'),
                createdAt: now,
                updatedAt: now,
                inForPerson: {
                    candidate: {
                        cv_city_id: cv_city_id,
                        cv_cate_id: cv_cate_id,
                        cv_title: cv_title
                    }
                }
            };
            let User = new Users(data)

            // lưu ứng viên
            await User.save();

            // Xóa ứng viên tại bảng tạm
            await userUnset.findOneAndDelete({ usePhoneTk: phoneTK });

            // Tạo token
            // const token = await functions.createToken(data, "1d");
            const token = await functions.createToken({
                _id: getMaxUserID._id,
                idTimViec365: getMaxUserID._idTV365,
                idQLC: getMaxUserID._idQLC,
                idRaoNhanh365: getMaxUserID._idRN365,
                email: phone,
                phoneTK: getMaxUserID.phoneTK,
                createdAt: now,
                type: 0,
                com_id: 0
            }, "1d");
            // Trả về kết quả cho client
            return functions.success(res, "Đăng kí thành công", { user_id: data.idTimViec365, access_token: token });

        } else return functions.setError(res, "Thông tin truyền lên không đầy đủ", 200);
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi đăng kí", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 200)
    }
}

exports.authentic = async(req, res) => {
    try {
        const userID = req.user.data._id;
        const checkUser = await Users.findOne({
            _id: userID,
            authentic: 0
        });

        if (checkUser) {
            const now = functions.getTimeNow();
            let data = {
                authentic: 1,
                use_show: 1,
                use_check: 1,
            }
            if (checkUser.inForPerson.candidate) {
                data = {
                    "inForPerson.candidate.user_reset_time": now,
                    ...data
                };
            }
            await Users.updateOne({ _id: userID }, {
                $set: data
            });
            return functions.success(res, "Cập nhật thành công");
        }
        return functions.setError(res, "Tài khoản đã được kích hoạt");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
}

// b1: gửi mã otp tới tên tài khoản được nhập
exports.sendOTP = async(req, res, next) => {
    try {
        const phoneTK = req.body.phoneTK,
            otp = req.body.otp;
        const user = await Users.findOne({ phoneTK: phoneTK, type: { $ne: 1 } }).select('idTimViec365').lean();
        if (user) {
            await Users.updateOne({ _id: user._id }, {
                $set: {
                    otp: otp
                }
            });
            return functions.success(res, 'Cập nhật mã otp thành công', { IdTv365: user.idTimViec365 });
        }
        return functions.setError(res, "Tài khoản không tồn tại. ", 404)
    } catch (e) {
        console.log(e);
        return functions.setError(res, "Gửi OTP lỗi3", )
    }
};

exports.forgotPassConfirmOTP = async(req, res) => {
    try {
        const { idTv365, type } = req.body;
        if (idTv365 && type) {
            let condition = { idTimViec365: idTv365 };
            // NTD
            if (type == 1) {
                condition.type = 1;
            } else {
                condition.type = { $ne: 1 };
            }
            const user = await Users.findOne(condition).select("otp type").lean();
            if (user) {
                const obj = { otp: user.otp, idTv365: idTv365, type: user.type };
                const base64 = Buffer.from(JSON.stringify(obj)).toString('base64');
                return functions.success(res, 'Xác thực thành công', { base64 });
            }
            return functions.setError(res, "Người dùng không tồn tại")
        }
        return functions.setError(res, "Chưa truyền OTP")
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

exports.forgotPassChangePassword = async(req, res) => {
    try {
        const { token, password } = req.body;
        if (token && password) {
            let decodeToken = Buffer.from(token, "base64").toString("utf-8");
            const obj = JSON.parse(decodeToken);
            const findUser = await Users.findOne({
                idTimViec365: obj.idTv365,
                type: obj.type,
                otp: obj.otp
            }).lean();

            if (findUser) {
                await Users.updateOne({ _id: findUser._id }, {
                    $set: { password: md5(password) }
                });
                const token = await functions.createToken({
                    _id: findUser._id,
                    idTimViec365: findUser.idTimViec365,
                    idQLC: findUser.idQLC,
                    idRaoNhanh365: findUser.idRaoNhanh365,
                    email: findUser.email,
                    phoneTK: findUser.phoneTK,
                    createdAt: findUser.createdAt,
                    type: findUser.type
                }, "1d");
                return functions.success(res, "Oke", {
                    data: {
                        access_token: token,
                        idTimViec365: findUser.idTimViec365,
                        type: findUser.type,
                        password: md5(password),
                        chat365_id: findUser._id
                    }
                });
            } else {
                return functions.setError(res, "Tài khoản không tồn tại");
            }
        }
        return functions.setError(res, "Thiếu thông tin");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

// b2: xác nhận mã otp sau khi đăng ký
exports.confirmOTP = async(req, res, next) => {
    try {
        const _id = req.user.data._id;
        const otp = req.body.otp;
        const verify = await Users.findOne({ _id: _id, otp }); // tìm user với dk có otp === otp người dùng nhập
        if (verify) {
            const token = await functions.createToken(verify, '1h');
            return functions.success(res, 'Xác thực OTP thành công', { access_token: token });
        } else {
            return functions.setError(res, "Otp không chính xác", 404);
        }
    } catch (e) {
        return functions.setError(res, 'Xác nhận OTP lỗi');
    }

};

//b3: đổi mật khẩu
exports.changePassword = async(req, res, next) => {
    try {
        const password = req.body.password;
        const _id = req.user.data._id;

        if (_id && password) {
            await Users.updateOne({ _id: _id }, { // update mật khẩu
                $set: {
                    password: md5(password)
                }
            });
            return functions.success(res, 'Đổi mật khẩu thành công');
        };
        return functions.setError(res, 'Đổi mật khẩu lỗi');
    } catch (e) {
        return functions.setError(res, 'Đổi mật khẩu lỗi');
    }
};

//đổi mật khẩu 
//B1L gửi otp
exports.sendOTPChangePass = async(req, res, next) => {
    try {
        const user = req.user.data.phoneTK;
        const type = req.user.data.type
        if (await functions.checkPhoneNumber(user) && await functions.getDatafindOne(Users, { phoneTK: user, type: type })) {
            await functions.getDataAxios("http://43.239.223.142:9000/api/users/RegisterMailOtp", { user })
                .then((response) => {
                    const otp = response.data.otp;
                    if (otp) {
                        return Users.updateOne({ phoneTK: user, type: type }, {
                            $set: {
                                otp: otp
                            }
                        });
                    }
                    functions.setError(res, "Gửi OTP lỗi 1", );
                })
                .then(() => {
                    functions.getDatafindOne(Users, { phoneTK: user, type: type }, )
                        .then(async(response) => {
                            const token = await functions.createToken(response, '30m'); // tạo token chuyển lên headers
                            res.setHeader('authorization', `Bearer ${token}`);
                            return functions.success(res, 'Gửi OTP thành công');
                        });
                });

        }
        // else if (await functions.checkEmail(user) && await functions.getDatafindOne(Users, { email: user, type: type }, )) {
        //     await functions.getDataAxios("http://43.239.223.142:9000/api/users/RegisterMailOtp", { user })
        //         .then((response) => {
        //             const otp = response.data.otp;
        //             if (otp) {
        //                 return Users.updateOne({ email: user, type: type }, {
        //                     $set: {
        //                         otp: otp
        //                     }
        //                 });
        //             }
        //             functions.setError(res, 'Gửi OTP lỗi 2', );
        //         })
        //         .then(() => {
        //             Users.findOne({ email: user, type: type })
        //                 .then(async(response) => {
        //                     const token = await functions.createToken(response, '30m');
        //                     res.setHeader('authorization', `Bearer ${token}`);
        //                     return functions.success(res, 'Gửi OTP thành công');
        //                 });
        //         });
        // } 
        else {
            return functions.setError(res, "Tài khoản không tồn tại. ", 404)
        }
    } catch (e) {
        return functions.setError(res, "Gửi OTP lỗi3", )
    }

};

//ứng viên đăng nhập
exports.loginUv = async(req, res, next) => {
    try {
        if (req.body.account && req.body.password) {
            const type = 0;
            const account = req.body.account;
            let password = req.body.password;
            const password_type = req.body.password_type || 0;

            password = (password_type == 0) ? md5(password) : password;

            let checkPhoneNumber = await functions.checkPhoneNumber(account);
            if (checkPhoneNumber) {
                var findUser = await functions.getDatafindOne(Users, { phoneTK: account, password: password, type: { $ne: 1 } });
            } else {
                var findUser = await functions.getDatafindOne(Users, { email: account, password: password, type: { $ne: 1 } });
            }

            if (findUser) {
                const token = await functions.createToken({
                    _id: findUser._id,
                    idTimViec365: findUser.idTimViec365,
                    idQLC: findUser.idQLC,
                    idRaoNhanh365: findUser.idRaoNhanh365,
                    email: findUser.email,
                    phoneTK: findUser.phoneTK,
                    createdAt: findUser.createdAt,
                    type: 0
                }, "1d");

                // Cập nhật thời gian login
                const dateNowInt = functions.getTimeNow();
                await Users.updateOne({ _id: findUser._id }, {
                    $set: {
                        time_login: dateNowInt,
                        isOnline: 1,
                        updatedAt: dateNowInt
                    }
                });
                let user_infor = {
                    "use_id": findUser.idTimViec365,
                    "chat365_id": findUser._id,
                    "use_email": findUser.email,
                    "use_first_name": findUser.userName,
                    "use_update_time": findUser.updatedAt,
                    "use_logo": findUser.avatarUser,
                    "use_phone": findUser.phone,
                    "use_city": findUser.city,
                    "use_quanhuyen": findUser.district,
                    "use_address": findUser.address,
                    "use_authentic": findUser.authentic,
                };
                if (findUser.inForPerson != null) {
                    if (findUser.inForPerson.account) {
                        user_infor = {
                            "use_gioi_tinh": findUser.inForPerson.account.gender,
                            "use_birth_day": findUser.inForPerson.account.birthday,
                            "use_hon_nhan": findUser.inForPerson.account.married,
                            ...user_infor
                        };
                    }
                    if (findUser.inForPerson.candidate) {
                        user_infor = {
                            "use_view": findUser.inForPerson.candidate.use_view,
                            "cv_title": findUser.inForPerson.candidate.cv_title,
                            ...user_infor
                        };
                    }

                }
                return functions.success(res, 'Đăng nhập thành công', {
                    access_token: token,
                    user_infor: user_infor
                });
            }
            return functions.setError(res, "Tài khoản hoặc mật khẩu không đúng");


        } else {
            return functions.setError(res, "Thiếu tham số đầu vào", 404);
        }
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// trang qlc trong hoàn thiện hồ sơ
exports.completeProfileQlc = async(req, res, next) => {
    try {
        const user = req.user.data;
        const inforUser = await Users.findOne({ _id: user._id }).lean();

        let phoneTK = inforUser.phoneTK;
        let postAI = [];
        let userId = inforUser.idTimViec365;

        let candiCateID = Number(inforUser.inForPerson.candidate.cv_cate_id[0]) || 1;
        let candiCityID = Number(inforUser.inForPerson.candidate.cv_city_id[0]) || 1;

        //việc làm AI
        try {
            let takeData = await axios({
                method: "post",
                url: "http://43.239.223.10:4001/recommendation_ungvien_tin",
                data: {
                    site_uv: "uvtimviec365",
                    site_job: "timviec365",
                    use_id: userId,
                    size: 6,
                    pagination: 1
                },
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (takeData.data.data != null && takeData.data.data.list_id != '') {
                let listNewId = takeData.data.data.list_id.split(",").map(Number);

                postAI = await newTV365.aggregate([{
                        $match: {
                            new_id: { $in: listNewId },
                        }
                    },
                    {
                        $lookup: {
                            from: "Users",
                            localField: "new_user_id",
                            foreignField: "idTimViec365",
                            as: "user"
                        }
                    },
                    {
                        $unwind: "$user"
                    },
                    {
                        $project: {
                            new_id: 1,
                            usc_company: '$user.userName',
                            usc_logo: '$user.avatarUser',
                            usc_id: '$user.idTimViec365',
                            usc_alias: '$user.alias',
                            usc_create_time: '$user.createdAt',
                            new_title: 1,
                            new_alias: 1,
                            new_city: 1,
                            new_han_nop: 1,
                            new_hot: 1,
                            new_cao: 1,
                            new_gap: 1,
                            new_money: 1,
                            nm_type: 1,
                            nm_id: 1,
                            nm_min_value: 1,
                            nm_max_value: 1,
                            nm_unit: 1,
                        }
                    },
                ]);

                for (let i = 0; i < postAI.length; i++) {
                    const element = postAI[i]
                    element.usc_logo = functions.getUrlLogoCompany(element.usc_create_time, element.usc_logo);
                }
            }
        } catch (e) {
            console.log(e)
        }

        // Mẫu Cv của tôi
        let myCv = await SaveCvCandi.aggregate([{
                $match: {
                    uid: userId
                }
            },
            {
                $lookup: {
                    from: "CV",
                    localField: "cvid",
                    foreignField: "_id",
                    as: "cv"
                }
            },
            {
                $unwind: "$cv"
            },
            {
                $skip: 0
            },
            {
                $project: {
                    img: '$nameImage',
                    title: '$cv.name',
                    link_edit: '$cv.alias',
                    cv_id: '$cv._id',
                    cv_xoa: 'deleteCv',
                    cv_daidien: `0`
                }
            },
        ]);

        for (let i = 0; i < myCv.length; i++) {
            const element = myCv[i];
            element.img = await functions.hostCvUvUpload(userId, element.img);
            element.link_edit = element.link_edit;
            element.link_dowload = serviceCv365.rewrite_cv_download(element.cv_id, userId, element.title);
            // element.link_dowload = await functions.hostCvUvUpload(userId, element.link_dowload)
        }

        //Mẫu CV đề xuất
        const CategoryCV = await Cv365Category.findOne({
            cid: candiCateID,
            _id: { $ne: 217 }
        }, {
            _id: 1,
            alias: 1,
            name: 1
        }).limit(1).lean();

        let findCv = [];
        if (CategoryCV) {
            findCv = await CV.find({
                    status: 1,
                    cate_id: CategoryCV._id,
                    _id: { $ne: 217 }
                })
                .select("name alias cate_id url_alias image cid")
                .sort({ vip: -1, _id: -1 })
                .limit(10);

            for (let i = 0; i < findCv.length; i++) {
                const element = findCv[i];
                element.image = await functions.getPictureCv(element.image)
            }
        }


        //số việc làm đã ứng tuyển
        const count_ut = await functions.findCount(applyForJob, { nhs_use_id: userId }) || 0;

        // Số việc làm phù hợp
        const count_ph = await functions.findCount(newTV365, {
            new_city: { $all: [candiCityID] },
            // new_cat_id: { $all: [candiCateID] },
            new_active: 1
        });

        //nhà tuyển dụng xem hồ sơ
        let count_xem_hs = await functions.findCount(pointUsed, { use_id: userId, type: 1 })

        let myBlog = await blog.find({
            new_301: '',
            new_active: 1,
            new_tag_cate: candiCateID
        }, "new_id new_title new_title_rewrite new_picture").sort({ new_id: -1 }).limit(3);

        for (let i = 0; i < myBlog.length; i++) {
            // myBlog[i].link = await functionsBlog.hostBlog(myBlog[i].link, myBlog[i]._id)
            myBlog[i].new_picture = await functions.getPictureBlogTv365(myBlog[i].new_picture)
        }

        await functions.success(res, "Hiển thị qlc thành công", {
            data: {
                listsVlAI: postAI,
                listsMyCv: myCv,
                items_cvdx: findCv,
                count_ut,
                count_ph,
                count_xem_hs,
                myBlog
            }
        })
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, e.message, 400);
    }

}

// danh sách cv xin việc và cv yêu thích của ứng viên
exports.cvXinViec = async(req, res, next) => {
    try {
        const user = req.user.data;
        let userID = Number(user.idTimViec365);
        let CV = await SaveCvCandi.aggregate([{
                $match: {
                    uid: userID,
                    delete_cv: 0
                }
            },
            {
                $lookup: {
                    from: "Cv365",
                    localField: "cvid",
                    foreignField: "_id",
                    as: "cv365"
                }
            },
            {
                $unwind: "$cv365"
            },
            {
                $skip: 0
            },
            {
                $project: {
                    cv_image: '$name_img',
                    cv_title: '$cv365.name',
                    cv_update: '$cv365.url_alias',
                    cv_id: '$cvid',
                    cv_daidien: "$cv"
                }
            },
        ]);
        for (let i = 0; i < CV.length; i++) {
            const element = CV[i];
            element.cv_image = functions.imageCv(user.createdAt, element.cv_image);
            element.cv_dowload = serviceCv365.rewrite_cv_download(element.cv_id, userID, element.cv_title);
            element.cv_update = serviceCv365.rewrite_cv_update(element.cv_update);
        }

        let CV_luu = await like.aggregate([{
                $match: {
                    uid: userID,
                    type: 1
                }
            },
            {
                $lookup: {
                    from: "Cv365",
                    localField: "id",
                    foreignField: "_id",
                    as: "cv365"
                }
            },
            {
                $unwind: "$cv365"
            },
            {
                $skip: 0
            },
            {
                $project: {
                    _id: 0,
                    cv_image: '$cv365.image',
                    cv_title: '$cv365.name',
                    url_alias: '$cv365.url_alias',
                    cv_id: '$id',
                }
            },
        ]);
        for (let i = 0; i < CV_luu.length; i++) {
            const element = CV_luu[i];
            element.cv_image = functions.getPictureCv(element.cv_image);
            element.cv_xem = serviceCv365.rewrite_cv_xem(element.url_alias);
            element.cv_update = serviceCv365.rewrite_cv_update(element.url_alias);
        }

        functions.success(res, "Hiển thị những CV Đã tạo và yêu thích thành công", { CV, CV_luu });
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

// Cập nhật cv đại diện
exports.chooseCv = async(req, res) => {
    try {
        const userID = req.user.data.idTimViec365,
            cvid = req.body.cvid;
        if (cvid) {
            // Cập nhật các cv đã tạo về trạng thái = 0
            await SaveCvCandi.updateMany({
                uid: userID
            }, {
                $set: {
                    cv: 0
                }
            });

            // Cập nhật trạng thái cv đại diện cho cv được chọn
            await SaveCvCandi.updateOne({
                uid: userID,
                cvid: cvid
            }, {
                $set: {
                    cv: 1
                }
            });
            return functions.success(res, "Cập nhật trạng thái cv đại diện thành công");
        }
        return functions.setError(res, "Chưa truyền cv id", 400);
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

// Xóa cv
exports.delfile = async(req, res) => {
    try {
        const userID = req.user.data.idTimViec365,
            id = req.body.id,
            type = req.body.type;

        if (type && id) {
            if (type == 'cv') {
                // Check xem cv đã tạo hay chưa
                const checkCv = await SaveCvCandi.findOne({
                    uid: userID,
                    cvid: id,
                    delete_cv: 0
                }).limit(1).lean();

                if (checkCv) {
                    // Cập nhật thời gian xóa
                    await SaveCvCandi.updateOne({
                        id: checkCv.id
                    }, {
                        $set: {
                            delete_cv: 1,
                            delete_time: functions.getTimeNow()
                        }
                    });
                    return functions.success(res, "Xóa cv thành công");
                }
                return functions.setError(res, "Cv chưa được tạo");
            } else if (type == 'donxinviec') {
                const check = await SaveAppli.findOne({
                    tid: id,
                    uid: userID
                }).lean();
                if (check) {
                    await SaveAppli.deleteOne({
                        _id: check._id
                    });
                    return functions.success(res, "Xóa thành công");
                }
                return functions.setError(res, "Đơn chưa được tạo");
            }
        }
        return functions.setError(res, "Thiếu tham số");
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

// danh sách đơn xin việc và đơn yêu thích của ứng viên
exports.donXinViec = async(req, res, next) => {
    try {
        const page = Number(req.body.page) || 1,
            pageSize = Number(req.body.pageSize) || 10,
            skip = (page - 1) * pageSize,
            userID = req.user.data.idTimViec365,
            listApply = await SaveAppli.aggregate([{
                    $match: {
                        uid: userID
                    }
                }, {
                    $lookup: {
                        from: "Application",
                        localField: "tid",
                        foreignField: "_id",
                        as: "application"
                    }
                },
                { $unwind: "$application" },
                {
                    $sort: { id: -1 }
                }, {
                    $project: {
                        name_img: "$name_img",
                        don_title: "$application.name",
                        don_id: "$tid",
                        alias: "$application.alias"
                    }
                }
            ]),
            // listApplyLike = await functions.pageFind(like, { userId: userID, type: 3 }, { _id: 1 });
            listApplyLike = await like.aggregate([{
                    $match: { uid: userID, type: 2 }
                },
                {
                    $lookup: {
                        from: "Application",
                        localField: "id",
                        foreignField: "_id",
                        as: "application"
                    }
                },
                { $unwind: "$application" },
                {
                    $project: {
                        name_img: "$application.image",
                        don_title: "$application.name",
                        don_id: "$id",
                        alias: "$application.alias"
                    }
                }
            ]);

        for (let i = 0; i < listApply.length; i++) {
            const element = listApply[i];
            element.don_image = serviceCv365.getImageCv(userID, element.name_img);
            element.don_update = serviceCv365.rewrite_don_update(element.alias);
            element.don_dowload = serviceCv365.rewrite_cv_download(element.tid, userID, element.don_title);
        }

        for (let j = 0; j < listApplyLike.length; j++) {
            const element = listApplyLike[j];
            element.don_image = functions.getPictureAppli(element.name_img);
            element.don_link = serviceCv365.rewrite_don_update(element.alias);
            element.don_xemtrc = functions.getPictureAppli(element.name_img);
        }

        return functions.success(res, "Hiển thị những đơn xin việc Đã tạo và yêu thích thành công", {
            don: listApply,
            don_luu: listApplyLike
        });

    } catch (e) {
        console.log("Đã có lỗi xảy ra", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

// danh sách thư xin việc và thư yêu thích của ứng viên
exports.thuXinViec = async(req, res, next) => {
    try {
        const page = Number(req.body.page) || 1,
            pageSize = Number(req.body.pageSize) || 10,
            skip = (page - 1) * pageSize,
            userID = req.user.data.idTimViec365,
            listLetter = await LetterUV.aggregate([{
                    $match: {
                        uid: userID
                    }
                }, {
                    $lookup: {
                        from: "Letter",
                        localField: "tid",
                        foreignField: "_id",
                        as: "letter"
                    }
                },
                { $unwind: "$letter" },
                {
                    $sort: { id: -1 }
                }, {
                    $project: {
                        name_img: "$name_img",
                        thu_title: "$letter.name",
                        thu_id: "$tid",
                        alias: "$letter.alias"
                    }
                }
            ]),
            listLike = await like.aggregate([{
                    $match: { uid: userID, type: 3 }
                },
                {
                    $lookup: {
                        from: "Letter",
                        localField: "id",
                        foreignField: "_id",
                        as: "letter"
                    }
                },
                { $unwind: "$letter" },
                {
                    $project: {
                        name_img: "$letter.image",
                        thu_title: "$letter.name",
                        thu_id: "$id",
                        alias: "$letter.alias"
                    }
                }
            ]);

        for (let i = 0; i < listLetter.length; i++) {
            const element = listLetter[i];
            element.thu_image = serviceCv365.getImageCv(userID, element.name_img);
            element.thu_update = serviceCv365.rewrite_don_update(element.alias);
            element.thu_dowload = serviceCv365.rewrite_cv_download(element.tid, userID, element.thu_title);
        }

        for (let j = 0; j < listLike.length; j++) {
            const element = listLike[j];
            element.thu_image = functions.getPictureAppli(element.name_img);
            element.thu_link = serviceCv365.rewrite_don_update(element.alias);
            element.thu_xemtrc = functions.getPictureAppli(element.name_img);
        }

        return functions.success(res, "Hiển thị những thư xin việc Đã tạo và yêu thích thành công", {
            thu: listLetter,
            thu_luu: listLike
        });

    } catch (e) {
        console.log("Đã có lỗi xảy ra", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

// danh sách hồ sơ xin việc và hồ sơ yêu thích của ứng viên
exports.hosoXinViec = async(req, res, next) => {
    try {
        if (req.user) {
            let page = Number(req.body.page)
            let pageSize = Number(req.body.pageSize)
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let userId = req.user.data.idTimViec365
            let findHoSoUv = await functions.pageFind(HoSoUV, { userId }, { _id: 1 }, skip, limit)
            const totalCount = await HoSoUV.countDocuments({ userId: userId })
            const totalPages = Math.ceil(totalCount / pageSize)

            let findFavorHoSoUv = await functions.pageFind(like, { userId: userId, type: 2 }, { _id: 1 }, skip, limit)
            const totalCountFavor = await like.countDocuments({ userId: userId, type: 2 })
            const totalPagesFavor = Math.ceil(totalCountFavor / pageSize)
            if (findHoSoUv) {
                functions.success(res, "Hiển thị những HoSo xin việc Đã tạo và yêu thích thành công", { HoSoUV: { totalCount, totalPages, listHoSo: findHoSoUv }, HoSoUVFavor: { totalCountFavor, totalPagesFavor, listHoSoFavor: findFavorHoSoUv } });
            }
        } else {
            return functions.setError(res, "Token không hợp lệ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

exports.deleteFile = async(req, res, next) => {
    try {
        const { type, id } = req.body;
        const user = req.user.data;
        if (type && id) {
            if (type == 'cv') {
                const checkUserSaveCv = await SaveCvCandi.findOne({

                });
            }
        }


    } catch (error) {
        console.log(error.message);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//danh sách tin ứng tuyển ứng viên đã ứng tuyển
exports.listJobCandidateApply = async(req, res, next) => {
    try {
        let page = Number(req.body.page) || 1,
            pageSize = Number(req.body.pageSize) || 10,
            userId = req.user.data.idTimViec365,
            match = {
                nhs_use_id: userId,
                nhs_kq: { $nin: [10, 11, 12, 14] }
            },
            lookUpUser = {
                from: "Users",
                localField: "nhs_com_id",
                foreignField: "idTimViec365",
                as: "user"
            },
            lookUpNewTv365 = {
                from: "NewTV365",
                localField: "nhs_new_id",
                foreignField: "new_id",
                as: "new"
            },
            total = 0;
        const skip = (page - 1) * pageSize;
        let listJobUv = await applyForJob.aggregate([{
                $match: match
            },
            {
                $lookup: lookUpUser
            },
            {
                $unwind: "$user"
            },
            {
                $match: {
                    "user.type": 1
                }
            },
            {
                $lookup: lookUpNewTv365
            },
            {
                $unwind: "$new"
            },
            {
                $project: {
                    new_id: "$new.new_id",
                    new_title: "$new.new_title",
                    new_alias: "$new.new_alias",
                    new_han_nop: "$new.new_han_nop",
                    usc_id: "$user.idTimViec365",
                    usc_company: "$user.userName",
                    usc_alias: "$user.alias",
                    nhs_time: "$nhs_time",
                    nhs_kq: "$nhs_kq"
                }
            },
            {
                $sort: {
                    nhs_time: -1
                }
            },
            {
                $skip: skip
            },
            {
                $limit: pageSize
            }
        ]);

        if (listJobUv.length > 0) {
            let countJobUv = await applyForJob.aggregate([{
                    $match: match
                },
                {
                    $lookup: lookUpUser
                },
                {
                    $unwind: "$user"
                },
                {
                    $match: {
                        "user.type": 1
                    }
                },
                {
                    $lookup: lookUpNewTv365
                },
                {
                    $unwind: "$new"
                },
                {
                    $count: "total"
                }
            ]);
            total = countJobUv[0].total;
        }

        return functions.success(res, "Lấy thông tin thành công", { items: listJobUv, total });
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

// Xóa tin tuyển dụng đã ứng tuyển
exports.deleteJobCandidateApply = async(req, res) => {
    try {
        const idtin = req.body.idtin,
            userID = req.user.data.idTimViec365;

        if (idtin) {
            const check_ut = await applyForJob.findOne({
                nhs_new_id: idtin,
                nhs_use_id: userID
            });
            if (check_ut) {
                await applyForJob.deleteOne({
                    nhs_new_id: idtin,
                    nhs_use_id: userID
                });
                return functions.success(res, "Xóa thành công");
            }
            return functions.setError(res, "Bạn chưa ứng tuyển", 400);
        }

    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//danh sách tin ứng viên đã lưu
exports.listJobCandidateSave = async(req, res, next) => {
    try {
        if (req.user) {
            let page = Number(req.body.page) || 1,
                pageSize = Number(req.body.pageSize) || 10,
                userId = Number(req.user.data.idTimViec365),
                total = 0;
            const skip = (page - 1) * pageSize;

            let listJobUvSave = await userSavePost.aggregate([{
                    $match: {
                        use_id: userId
                    }
                },
                {
                    $lookup: {
                        from: "NewTV365",
                        localField: "new_id",
                        foreignField: "new_id",
                        as: "new"
                    }
                },
                {
                    $unwind: "$new"
                },
                {
                    $lookup: {
                        from: "Users",
                        localField: "new.new_user_id",
                        foreignField: "idTimViec365",
                        as: "user"
                    }
                },
                {
                    $unwind: "$user"
                },
                {
                    $match: {
                        "user.type": 1
                    }
                },
                {
                    $project: {
                        new_id: "$new.new_id",
                        new_title: "$new.new_title",
                        new_alias: "$new.new_alias",
                        new_han_nop: "$new.new_han_nop",
                        new_active: "$new.new_active",
                        usc_id: "$user.idTimViec365",
                        usc_company: "$user.userName",
                        usc_alias: "$user.alias"
                    }
                },
                {
                    $sort: {
                        _id: -1
                    }
                },
                {
                    $skip: skip
                },
                {
                    $limit: pageSize
                }
            ]);
            if (listJobUvSave.length > 0) {
                let countJobUvSave = await userSavePost.aggregate([{
                        $match: {
                            use_id: userId
                        }
                    },
                    {
                        $lookup: {
                            from: "NewTV365",
                            localField: "new_id",
                            foreignField: "new_id",
                            as: "new"
                        }
                    },
                    {
                        $unwind: "$new"
                    },
                    {
                        $lookup: {
                            from: "Users",
                            localField: "new.new_user_id",
                            foreignField: "idTimViec365",
                            as: "user"
                        }
                    },
                    {
                        $unwind: "$user"
                    },
                    {
                        $match: {
                            "user.type": 1
                        }
                    },
                    {
                        $count: "total"
                    }
                ]);

                total = countJobUvSave[0].total;
            }

            return functions.success(res, "Hiển thị những việc làm ứng viên đã ứng tuyển thành công", { item: listJobUvSave, total });
        } else {
            return functions.setError(res, "Token không hợp lệ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật thông tin liên hệ
exports.updateContactInfo = async(req, res, next) => {
    try {
        let request = req.body,
            userID = req.user.data._id,
            userName = request.name,
            phone = request.phone,
            address = request.address,
            birthday = request.birthday,
            gender = request.gioitinh,
            married = request.honnhan,
            city = request.thanhpho,
            district = request.quanhuyen,
            avatarUser = req.file;
        if (req.user && userName && phone && address && birthday &&
            gender && married && city && district) {

            await Users.updateOne({ _id: userID }, {
                $set: {
                    userName: userName,
                    phone: phone,
                    address: address,
                    city: city,
                    district: district,
                    updatedAt: functions.getTimeNow(),
                    "inForPerson.account.birthday": birthday,
                    "inForPerson.account.gender": gender,
                    "inForPerson.account.married": married
                }
            });
            functions.success(res, "Cập nhật thông tin liên hệ thành công,");
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log(e.message);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật công việc mong muốn
exports.updateDesiredJob = async(req, res, next) => {
    try {
        let userID = req.user.data._id,
            candiTitle = req.body.title,
            candiLoaiHinh = req.body.ht,
            candiCityID = req.body.city,
            candiCateID = req.body.cate,
            exp = req.body.kn,
            candiCapBac = req.body.capbac,
            candiMoney = req.body.money_kg,
            candiMoneyUnit = req.body.money_unit,
            candiMoneyType = req.body.money_type,
            candiMoneyMin = req.body.money_min,
            candiMoneyMax = req.body.money_max;

        if (candiTitle && candiLoaiHinh && candiLoaiHinh && candiCityID && candiCateID &&
            exp && candiCapBac && candiMoney) {
            // Cập nhật data
            await Users.updateOne({ _id: userID }, {
                $set: {
                    updatedAt: functions.getTimeNow(),
                    "inForPerson.candidate.cv_cate_id": candiCateID.split(',').map(Number),
                    "inForPerson.candidate.cv_city_id": candiCityID.split(',').map(Number),
                    "inForPerson.account.experience": exp,
                    "inForPerson.candidate.cv_capbac_id": candiCapBac,
                    "inForPerson.candidate.cv_title": candiTitle,
                    "inForPerson.candidate.cv_loaihinh_id": candiLoaiHinh,
                    "inForPerson.candidate.cv_money_id": candiMoney,
                    "inForPerson.candidate.um_unit": candiMoneyUnit,
                    "inForPerson.candidate.um_type": candiMoneyType,
                    "inForPerson.candidate.um_min_value": candiMoneyMin,
                    "inForPerson.candidate.um_max_value": candiMoneyMax
                }
            });
            return functions.success(res, "Cập nhật thông tin công việc mong muốn thành công");
        } else {
            return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Cập nhật thông tin công việc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật mục tiêu nghề nghiệp
exports.updateCareerGoals = async(req, res, next) => {
    try {
        if (req.user && req.body.muctieu) {

            let userId = req.user.data._id;
            let candiMucTieu = req.body.muctieu;

            await Users.updateOne({ _id: userId }, {
                $set: {
                    updatedAt: functions.getTimeNow(),
                    "inForPerson.candidate.cv_muctieu": candiMucTieu,
                }
            }).then(() => {
                return functions.success(res, "Cập nhật mục tiêu nghề nghiệp thành công");
            });

        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log(e.message);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật kỹ năng bản thân
exports.updateSkills = async(req, res, next) => {
    try {
        if (req.user && req.body.kynang) {
            let userId = req.user.data._id;
            let cv_kynang = req.body.kynang;

            await Users.updateOne({ _id: userId }, {
                $set: {
                    updatedAt: functions.getTimeNow(),
                    "inForPerson.candidate.cv_kynang": cv_kynang,
                }
            });
            return functions.success(res, "Cập nhật kỹ năng nghề nghiệp thành công");
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật kỹ năng bản thân", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật thông tin người tham chiếu
exports.updateReferencePersonInfo = async(req, res, next) => {
    try {
        const userID = req.user.data._id,
            cv_tc_name = req.body.cv_tc_name,
            cv_tc_dc = req.body.cv_tc_dc,
            cv_tc_phone = req.body.cv_tc_phone,
            cv_tc_cv = req.body.cv_tc_cv,
            cv_tc_company = req.body.cv_tc_company,
            cv_tc_email = req.body.cv_tc_email;
        if (req.user && cv_tc_name && cv_tc_dc && cv_tc_phone && cv_tc_cv && cv_tc_email) {

            await Users.updateOne({ _id: userID }, {
                $set: {
                    "inForPerson.candidate.cv_tc_name": cv_tc_name,
                    "inForPerson.candidate.cv_tc_dc": cv_tc_dc,
                    "inForPerson.candidate.cv_tc_phone": cv_tc_phone,
                    "inForPerson.candidate.cv_tc_cv": cv_tc_cv,
                    "inForPerson.candidate.cv_tc_email": cv_tc_email,
                    "inForPerson.candidate.cv_tc_company": cv_tc_company,
                    updatedAt: functions.getTimeNow(),
                }
            });
            return functions.success(res, "Cập nhật Thông tin người tham chiếu thành công");
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ");
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật kỹ năng bản thân", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//Cập nhật video giới thiệu
exports.updateIntroVideo = async(req, res, next) => {
    try {
        const userID = req.user.data._id,
            videoLink = req.body.videoLink;

        let dataUpdate;
        if (req.file && !videoLink) {
            const videoName = req.file.filename;
            dataUpdate = {
                "inForPerson.candidate.cv_video": videoName,
                "inForPerson.candidate.cv_video_type": 1,
            };
        } else if (!req.body.file && videoLink) {
            dataUpdate = {
                "inForPerson.candidate.cv_video": videoLink,
                "inForPerson.candidate.cv_video_type": 2,
            };
        }

        if (dataUpdate) {
            dataUpdate.updatedAt = functions.getTimeNow();
            await Users.updateOne({ _id: userID }, {
                $set: dataUpdate
            });
            return functions.success(res, "Cập nhật thành công video");
        }
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật video giới thiệu", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//Thêm dữ liệu bằng cấp học vấn
exports.addDegree = async(req, res, next) => {
    try {
        const { truonghoc, bc, chuyennganh, xeploai, bosung, onetime, twotime } = req.body;
        if (req.user && truonghoc && bc && chuyennganh && xeploai && onetime && twotime) {
            const userID = req.user.data._id;

            const getProfileDegree = await Users.findOne({ _id: userID }, { "inForPerson.candidate.profileDegree.th_id": 1 }).sort({ "inForPerson.candidate.profileDegree.th_id": -1 }).limit(1).lean();

            if (getProfileDegree.inForPerson.candidate.profileDegree.length > 0) {
                newID = Number(getProfileDegree.inForPerson.candidate.profileDegree[getProfileDegree.inForPerson.candidate.profileDegree.length - 1].th_id + 1);
            } else newID = 1;

            await Users.updateOne({ _id: userID }, {
                $push: {
                    "inForPerson.candidate.profileDegree": {
                        th_id: newID,
                        th_name: truonghoc,
                        th_bc: bc,
                        th_cn: chuyennganh,
                        th_xl: xeploai,
                        th_bs: bosung,
                        th_one_time: onetime,
                        th_two_time: twotime
                    }
                },
                $set: {
                    updatedAt: functions.getTimeNow()
                }
            }).then(() => {
                return functions.success(res, "Thêm bằng cấp học vấn thành công");
            });
        } else {
            return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi thêm bằng cấp học vấn", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật bằng cấp học vấn
exports.updateDegree = async(req, res, next) => {
    try {
        const { truonghoc, bc, chuyennganh, xeploai, bosung, onetime, twotime, idhv } = req.body;
        if (req.user && truonghoc && bc && chuyennganh && xeploai && onetime && twotime && idhv) {
            const userID = req.user.data._id,
                id = Number(req.body.idhv);

            await Users.findOneAndUpdate({
                _id: userID,
                "inForPerson.candidate.profileDegree.th_id": id
            }, {
                $set: {
                    "inForPerson.candidate.profileDegree.$": {
                        th_id: id,
                        th_name: truonghoc,
                        th_bc: bc,
                        th_cn: chuyennganh,
                        th_xl: xeploai,
                        th_bs: bosung,
                        th_one_time: onetime,
                        th_two_time: twotime
                    },
                    updatedAt: functions.getTimeNow()
                },
            }).then(() => {
                return functions.success(res, "Cập nhật bằng cấp học vấn thành công");
            }).catch((err) => {
                console.log(err);
                return functions.setError(res, err);
            });
        } else {
            return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log(e.message);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//xóa bằng cấp học vấn
exports.deleteDegree = async(req, res, next) => {
    try {
        const { idhv } = req.body;
        if (req.user && idhv) {
            const userID = req.user.data._id,
                id = Number(req.body.idhv);

            const getDataDegree = await Users.findOne({
                _id: userID,
                "inForPerson.candidate.profileDegree.th_id": id
            }, { "inForPerson.candidate.profileDegree.$": 1 }).lean();

            if (getDataDegree) {
                await Users.updateOne({
                    _id: userID,
                    "inForPerson.candidate.profileDegree.th_id": id
                }, {
                    "$pull": {
                        "inForPerson.candidate.profileDegree": {
                            "th_id": id
                        }
                    }
                });
                return functions.success(res, "Xóa bằng cấp học vấn thành công");
            }
            return functions.setError(res, "Không tồn tại học vấn bằng cấp", 400);
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi xóa bằng cấp học vấn", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//làm mới hồ sơ
exports.RefreshProfile = async(req, res, next) => {
    try {
        if (req.user) {
            let userID = req.user.data._id;

            await Users.updateOne({ _id: userID }, {
                $set: {
                    updatedAt: functions.getTimeNow()
                }
            });

            return functions.success(res, "Làm mới hồ sơ thành công");
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật kỹ năng bản thân", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//Cập nhật ảnh đại diện
exports.updateAvatarUser = async(req, res, next) => {
    try {
        if (req.file) {
            const user = req.user.data;
            let userID = user._id;

            // Khai báo đường dẫn lưu file
            const targetDirectory = functions.folderUploadImageAvatar(user.createdAt);

            // Đặt lại tên file
            const originalname = req.file.originalname,
                extension = originalname.split('.').pop(),
                random = Math.random(),
                newFilename = "avatar_" + random + '.' + extension,
                // Đường dẫn tới file cũ
                oldFilePath = req.file.path,
                // Đường dẫn tới file mới
                newFilePath = path.join(targetDirectory, newFilename);

            // Di chuyển file và đổi tên file
            fs.rename(oldFilePath, newFilePath, async function(err) {
                if (err) {
                    console.error(err);
                    return functions.setError(res, "Lỗi khi đổi tên file", 400);
                }
            });

            await Users.updateOne({ _id: userID }, {
                avatarUser: newFilename,
                updatedAt: functions.getTimeNow()
            });

            return functions.success(res, "Cập nhật ảnh đại diện thành công");
        }
        return functions.setError(res, "Chưa tải ảnh đại diện");
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật ảnh đại diện", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//tải hồ sơ của tôi lên (cv)
exports.upLoadHoSo = async(req, res, next) => {
    try {
        if (req.body.cvname && req.files && req.files.cv) {
            const user = req.user.data;
            let userId = user.idTimViec365;
            const file_cv = req.files.cv;
            let nameHoSo = req.body.cvname;
            const targetDirectory = `../storage/base365/timviec365/pictures/cv/${functions.convertDate(user.createdAt,true)}`;
            // Đặt lại tên file
            const originalname = file_cv.originalFilename;
            const extension = originalname.split('.').pop();
            const uniqueSuffix = Date.now();
            const newFilename = "profile_" + uniqueSuffix + '.' + extension;

            // Đường dẫn tới file cũ
            const oldFilePath = file_cv.path;

            // Đường dẫn tới file mới
            const newFilePath = path.join(targetDirectory, newFilename);

            // Di chuyển file và đổi tên file
            fs.rename(oldFilePath, newFilePath, async function(err) {
                if (err) {
                    console.error(err);
                    return functions.setError(res, "Lỗi khi đổi tên file", 400);
                }
            });
            const now = functions.getTimeNow();

            // Cập nhật hs_active về 0
            await Profile.updateOne({ hs_use_id: userId }, {
                $set: { hs_active: 0 }
            });
            // Thêm mới
            const getMaxIdProfile = await Profile.findOne({}, { hs_id: 1 }).sort({ hs_id: -1 }).limit(1).lean();
            const dataUpload = {
                hs_id: getMaxIdProfile.hs_id + 1,
                hs_use_id: userId,
                hs_name: nameHoSo,
                hs_link: newFilename,
                hs_create_time: now,
                hs_active: 1
            };
            const profile = new Profile(dataUpload);
            await profile.save();
            return functions.success(res, "Lưu hồ sơ thành công");
        }
        return functions.setError(res, "Chưa truyền tên hồ sơ");
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi tải lên hồ sơ", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

// lấy ra danh sách hồ sơ đã tải
exports.listProfileUploaded = async(req, res) => {
    try {
        const user = req.user.data;
        const list = await Profile.find({ hs_use_id: user.idTimViec365 }).sort({ hs_id: -1 });
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            element.hs_link = service.getUrlProfile(user.createdAt, element.hs_link);
        }
        return functions.success(res, "Danh sách hồ sơ đã tải", { data: list });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

//Thêm dữ liệu Ngoại ngữ tin học
exports.addNgoaiNgu = async(req, res, next) => {
    try {
        let userID = req.user.data._id,
            chungchi = req.body.chungchi,
            point = req.body.sodiem,
            ngoaiNgu = req.body.ngoaingu;
        if (req.user && chungchi && point && ngoaiNgu) {

            const getProfileNgoaiNgu = await Users.findOne({ _id: userID }, { "inForPerson.candidate.profileNgoaiNgu.nn_id": 1 }).sort({ "inForPerson.candidate.profileNgoaiNgu.nn_id": -1 }).limit(1).lean();
            if (getProfileNgoaiNgu.inForPerson.candidate.profileNgoaiNgu.length > 0) {
                newID = Number(getProfileNgoaiNgu.inForPerson.candidate.profileNgoaiNgu[getProfileNgoaiNgu.inForPerson.candidate.profileNgoaiNgu.length - 1].nn_id + 1);
            } else newID = 1;

            await Users.findOneAndUpdate({ _id: userID }, {
                $push: {
                    "inForPerson.candidate.profileNgoaiNgu": {
                        nn_id: newID,
                        nn_id_pick: ngoaiNgu,
                        nn_cc: chungchi,
                        nn_sd: point,
                    }
                },
                $set: {
                    updatedAt: functions.getTimeNow()
                }
            });
            return functions.success(res, "Thêm ngoại ngữ thành công");
        } else {
            return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi thêm ngoại ngữ", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật Ngoại ngữ tin học
exports.updateNgoaiNgu = async(req, res, next) => {
    try {
        let userID = req.user.data._id,
            chungchi = req.body.chungchi,
            point = req.body.sodiem,
            ngoaiNgu = req.body.ngoaingu,
            nn_id = Number(req.body.idnn);

        if (req.user && chungchi && point && ngoaiNgu && nn_id) {
            await Users.findOneAndUpdate({
                _id: userID,
                "inForPerson.candidate.profileNgoaiNgu.nn_id": nn_id
            }, {
                $set: {
                    "inForPerson.candidate.profileNgoaiNgu.$": {
                        nn_id: nn_id,
                        nn_id_pick: ngoaiNgu,
                        nn_cc: chungchi,
                        nn_sd: point,
                    },
                    updatedAt: functions.getTimeNow()
                },
            })
            return functions.success(res, "Cập nhật ngoại ngữ thành công");
        } else {
            return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật ngoại ngữ", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//xóa Ngoại ngữ tin học
exports.deleteNgoaiNgu = async(req, res, next) => {
    try {
        let userID = req.user.data._id,
            nn_id = Number(req.body.idnn);

        if (req.user && nn_id) {
            const getDataLanguage = await Users.findOne({
                _id: userID,
                "inForPerson.candidate.profileNgoaiNgu.nn_id": nn_id
            }, { "inForPerson.candidate.profileNgoaiNgu.$": 1 }).lean();

            if (getDataLanguage) {
                await Users.updateOne({
                    _id: userID,
                    "inForPerson.candidate.profileNgoaiNgu.nn_id": nn_id
                }, {
                    "$pull": {
                        "inForPerson.candidate.profileNgoaiNgu": {
                            "nn_id": nn_id
                        }
                    },
                    $set: {
                        updatedAt: functions.getTimeNow()
                    }
                });
                return functions.success(res, "Xóa ngoại ngữ tin học thành công");
            }
            return functions.setError(res, "Không tồn tại ngoại ngữ tin học", 400);
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log(e.message);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//Thêm dữ liệu Kinh nghiệm làm việc
exports.addExp = async(req, res, next) => {
    try {
        let userID = req.user.data._id,
            kn_name = req.body.kn_name,
            kn_cv = req.body.kn_cv,
            kn_mota = req.body.kn_mota,
            kn_one_time = req.body.kn_one_time,
            kn_two_time = req.body.kn_two_time,
            kn_hien_tai = req.body.kn_hien_tai;

        if (kn_name && kn_cv && kn_mota && kn_one_time && kn_two_time) {
            const getProfileExperience = await Users.findOne({ _id: userID }, { "inForPerson.candidate.profileExperience.kn_id": 1 })
                .limit(1)
                .lean();
            if (getProfileExperience.inForPerson.candidate.profileExperience.length > 0) {
                newID = Number(getProfileExperience.inForPerson.candidate.profileExperience[getProfileExperience.inForPerson.candidate.profileExperience.length - 1].kn_id + 1);
            } else newID = 1;

            await Users.updateOne({ _id: userID }, {
                $push: {
                    "inForPerson.candidate.profileExperience": {
                        kn_id: newID,
                        kn_name: kn_name,
                        kn_cv: kn_cv,
                        kn_mota: kn_mota,
                        kn_one_time: kn_one_time,
                        kn_two_time: kn_two_time,
                        kn_hien_tai: kn_hien_tai
                    }
                },
                $set: {
                    updatedAt: functions.getTimeNow()
                }
            });

            return functions.success(res, "Thêm kinh nghiệm làm việc thành công");
        } else {
            return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log(e.message);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật Kinh nghiệm làm việc
exports.updateExp = async(req, res, next) => {
    try {
        let userID = req.user.data._id,
            kn_name = req.body.kn_name,
            kn_cv = req.body.kn_cv,
            kn_mota = req.body.kn_mota,
            kn_one_time = req.body.kn_one_time,
            kn_two_time = req.body.kn_two_time,
            kn_hien_tai = req.body.kn_hien_tai,
            kn_id = req.body.kn_id;
        if (kn_name && kn_cv && kn_mota && kn_one_time && kn_two_time && kn_id) {
            await Users.findOneAndUpdate({
                _id: userID,
                "inForPerson.candidate.profileExperience.kn_id": kn_id
            }, {
                $set: {
                    "inForPerson.candidate.profileExperience.$": {
                        kn_id: kn_id,
                        kn_name: kn_name,
                        kn_cv: kn_cv,
                        kn_mota: kn_mota,
                        kn_one_time: kn_one_time,
                        kn_two_time: kn_two_time,
                        kn_hien_tai: kn_hien_tai
                    },
                    updatedAt: functions.getTimeNow()
                },
            })

            return functions.success(res, "Cập nhật kinh nghiệm làm việc thành công");
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật kinh nghiệm làm việc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//xóa Kinh nghiệm làm việc
exports.deleteExp = async(req, res, next) => {
    try {
        const userID = req.user.data._id,
            kn_id = req.body.idkn;
        if (req.user && kn_id) {
            let updateUser = await Users.findOneAndUpdate({
                _id: userID,
                "inForPerson.candidate.profileExperience.kn_id": kn_id
            }, {
                "$pull": {
                    "inForPerson.candidate.profileExperience": {
                        "kn_id": kn_id
                    }
                },
                $set: {
                    updatedAt: functions.getTimeNow()
                }
            });
            return functions.success(res, "Xóa kinh nghiệm làm việc thành công");
        } else {
            return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log(e.message);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//hiển thị danh sách ứng viên theo tỉnh thành, vị trí
exports.selectiveUv = async(req, res, next) => {
    try {
        let page = Number(req.body.page)
        let pageSize = Number(req.body.pageSize)
        let city = req.body.city
        let cate = req.body.cate
        const skip = (page - 1) * pageSize;
        const limit = pageSize;

        if (city && !cate) {
            let findUv = await functions.pageFindV2(Users, { type: 0, city: city }, {
                userName: 1,
                city: 1,
                district: 1,
                address: 1,
                avatarUser: 1,
                isOnline: 1,
                inForPerson: 1
            }, { updatedAt: -1 }, skip, limit)
            const totalCount = await Users.countDocuments({ type: 0, city: city })
            const totalPages = Math.ceil(totalCount / pageSize)
            if (findUv) {
                functions.success(res, "Hiển thị ứng viên theo vị trí, ngành nghề thành công", { totalCount, totalPages, listUv: findUv });
            }
        } else if (!city && cate) {
            let listUv = []
            let findUv = await functions.pageFindV2(Users, { type: 0 }, {
                userName: 1,
                city: 1,
                district: 1,
                address: 1,
                avatarUser: 1,
                isOnline: 1,
                inForPerson: 1
            }, { updatedAt: -1 }, skip, limit)
            for (let i = 0; i < findUv.length; i++) {
                let listCateId = findUv[i].inForPerson.candiCateID.split(',')
                if (listCateId.includes(cate)) {
                    listUv.push(findUv[i])
                }
            }
            const totalCount = listUv.length
            const totalPages = Math.ceil(totalCount / pageSize)
            if (findUv) {
                functions.success(res, "Hiển thị ứng viên theo vị trí, ngành nghề thành công", { totalCount, totalPages, listUv: listUv });
            }
        } else if (city && cate) {
            let listUv = []
            let findUv = await functions.pageFindV2(Users, { type: 0, city: city }, {
                userName: 1,
                city: 1,
                district: 1,
                address: 1,
                avatarUser: 1,
                isOnline: 1,
                inForPerson: 1
            }, { updatedAt: -1 }, skip, limit)
            for (let i = 0; i < findUv.length; i++) {
                let listCateId = findUv[i].inForPerson.candiCateID.split(',')
                if (listCateId.includes(cate)) {
                    listUv.push(findUv[i])
                }
            }
            const totalCount = listUv.length
            const totalPages = Math.ceil(totalCount / pageSize)
            if (findUv) {
                functions.success(res, "Hiển thị ứng viên theo vị trí, ngành nghề thành công", { totalCount, totalPages, listUv: listUv });
            }
        } else if (!city && !cate) {
            let findRandomUv = await functions.pageFindV2(Users, { type: 0 }, {
                userName: 1,
                city: 1,
                district: 1,
                address: 1,
                avatarUser: 1,
                isOnline: 1,
                inForPerson: 1
            }, { updatedAt: -1 }, skip, limit)
            const totalCount = await Users.countDocuments({ type: 0 })
            const totalPages = Math.ceil(totalCount / pageSize)

            if (findRandomUv) {
                functions.success(res, "Hiển thị ứng viên ngẫu nhiên thành công", { totalCount, totalPages, listUv: findRandomUv });
            }
        }


    } catch (e) {
        console.log("Đã có lỗi xảy ra khi hiển thị ứng viên theo vị trí, ngành nghề", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//hiển thị ứng viên được gợi ý theo Ai365
exports.candidateAI = async(req, res, next) => {
    try {
        const use_id = req.body.use_id;
        if (use_id) {
            let list = []
            let listAI = await functions.getDataAxios("http://43.239.223.10:4001/recommendation_ungvien", {
                site: "uvtimviec365",
                use_id: use_id,
                pagination: 1,
                size: 20,
            });

            if (listAI.data && listAI.data.list_id != '') {
                list = await Users.find({
                    idTimViec365: { $in: listAI.data.list_id.split(',').map(Number) },
                    type: 0,
                    fromDevice: { $nin: [4, 7] }
                });
                list = await Users.aggregate([{
                    $match: {
                        idTimViec365: { $in: listAI.data.list_id.split(',').map(Number) },
                        type: 0,
                        fromDevice: { $nin: [4, 7] }
                    }
                }, {
                    $project: {
                        _id: 0,
                        "use_id": "$idTimViec365",
                        "use_email": "$email",
                        "use_phone_tk": "$phoneTK",
                        "use_phone": "$phone",
                        "use_first_name": "$userName",
                        "use_update_time": "$updatedAt",
                        "use_create_time": "$createdAt",
                        "use_logo": "$avatarUser",
                        "use_email_lienhe": "$emailContact",
                        "use_gioi_tinh": "$inForPerson.account.gender",
                        "use_birth_day": "$inForPerson.account.birthday",
                        "use_city": "$city",
                        "use_quanhuyen": "$district",
                        "cv_user_id": "$idTimViec365",
                        "cv_title": "$inForPerson.candidate.cv_title",
                        "cv_cate_id": "$inForPerson.candidate.cv_cate_id",
                        "cv_city_id": "$inForPerson.candidate.cv_city_id",
                        "cv_capbac_id": "$inForPerson.candidate.cv_capbac_id",
                        "cv_money_id": "$inForPerson.candidate.cv_money_id",
                        "cv_exp": "$inForPerson.account.experience",
                        "cv_kynang": "$inForPerson.candidate.cv_kynang",
                        "cv_tc_name": "$inForPerson.candidate.cv_tc_name",
                        "cv_tc_cv": "$inForPerson.candidate.cv_tc_cv",
                        "cv_tc_phone": "$inForPerson.candidate.cv_tc_phone",
                        "cv_tc_email": "$inForPerson.candidate.cv_tc_email",
                        "cv_tc_company": "$inForPerson.candidate.cv_tc_company",
                        "um_type": "$inForPerson.candidate.um_type",
                        "um_min_value": "$inForPerson.candidate.um_min_value",
                        "um_max_value": "$inForPerson.candidate.um_max_value",
                        "um_unit": "$inForPerson.candidate.um_unit",
                        "muc_luong": "$inForPerson.candidate.muc_luong",
                        "chat365_id": "$_id",
                        "id_qlc": "$idQLC"
                    }
                }]);

                for (let i = 0; i < list.length; i++) {
                    const element = list[i];
                    element.use_city = element.use_city ? element.use_city.toString() : "";
                    element.use_logo = functions.cdnImageAvatar(element.use_create_time) + element.use_logo;
                }
            }

            return functions.success(res, "Hiển thị ứng viên ngẫu nhiên theo ai thành công", { list });
        }
        return functions.setError(res, "Chưa truyền id ứng viên");
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi hiển thị ứng viên ngẫu nhiên theo ai", e);
        return functions.setError(res, e);
    }
}

//hiển thị thông tin chi tiết ứng viên theo 3 cách đăng kí
exports.infoCandidate = async(req, res, next) => {
    try {
        if (req.body.iduser) {
            const userId = Number(req.body.iduser);
            const useraggre = await Users.aggregate([{
                $match: {
                    idTimViec365: userId,
                    type: { $ne: 1 }
                }
            }, {
                $project: {
                    _id: 0,
                    "use_id": "$idTimViec365",
                    "use_email": "$email",
                    "use_phone_tk": "$phoneTK",
                    "use_phone": "$phone",
                    "use_first_name": "$userName",
                    "use_update_time": "$updatedAt",
                    "use_create_time": "$createdAt",
                    "use_logo": "$avatarUser",
                    "use_email_lienhe": "$emailContact",
                    "use_gioi_tinh": "$inForPerson.account.gender",
                    "use_birth_day": "$inForPerson.account.birthday",
                    "use_city": "$city",
                    "use_quanhuyen": "$district",
                    "use_address": "$address",
                    "use_hon_nhan": "$inForPerson.account.married",
                    "use_view": "$inForPerson.candidate.use_view",
                    "use_authentic": "$authentic",
                    "cv_user_id": "$idTimViec365",
                    "cv_title": "$inForPerson.candidate.cv_title",
                    "cv_exp": "$inForPerson.account.experience",
                    "cv_muctieu": "$inForPerson.candidate.cv_muctieu",
                    "cv_cate_id": "$inForPerson.candidate.cv_cate_id",
                    "cv_city_id": "$inForPerson.candidate.cv_city_id",
                    "cv_capbac_id": "$inForPerson.candidate.cv_capbac_id",
                    "cv_money_id": "$inForPerson.candidate.cv_money_id",
                    "cv_loaihinh_id": "$inForPerson.candidate.cv_loaihinh_id",
                    "cv_kynang": "$inForPerson.candidate.cv_kynang",
                    "cv_tc_name": "$inForPerson.candidate.cv_tc_name",
                    "cv_tc_cv": "$inForPerson.candidate.cv_tc_cv",
                    "cv_tc_phone": "$inForPerson.candidate.cv_tc_phone",
                    "cv_tc_email": "$inForPerson.candidate.cv_tc_email",
                    "cv_tc_company": "$inForPerson.candidate.cv_tc_company",
                    "cv_video": "$inForPerson.candidate.cv_video",
                    "cv_video_type": "$inForPerson.candidate.cv_video_type",
                    "cv_hocvan": "$inForPerson.account.education",
                    "um_type": "$inForPerson.candidate.um_type",
                    "um_min_value": "$inForPerson.candidate.um_min_value",
                    "um_max_value": "$inForPerson.candidate.um_max_value",
                    "um_unit": "$inForPerson.candidate.um_unit",
                    "muc_luong": "$inForPerson.candidate.muc_luong",
                    "profileDegree": "$inForPerson.candidate.profileDegree",
                    "profileNgoaiNgu": "$inForPerson.candidate.profileNgoaiNgu",
                    "profileExperience": "$inForPerson.candidate.profileExperience",
                    "user_xac_thuc": "$otp",
                    "use_show": "$inForPerson.candidate.use_show",
                    "chat365_id": "$_id",
                    "candidate": "$inForPerson.candidate",
                    "id_qlc": "$idQLC"
                }
            }]);


            if (useraggre.length > 0) {
                let userInfo = useraggre[0],
                    // Thông tin bằng cấp
                    bang_cap = (userInfo.profileDegree) ? userInfo.profileDegree : [],
                    // Thông tin ngoại ngữ
                    ngoai_ngu = (userInfo.profileNgoaiNgu) ? userInfo.profileNgoaiNgu : [],
                    // Thông tin kinh nghiệm
                    kinh_nghiem = (userInfo.profileExperience) ? userInfo.profileExperience : [];

                // Cập nhật đường dẫn ảnh đại diện
                userInfo.use_logo = functions.getImageUv(userInfo.use_create_time, userInfo.use_logo);

                if (userInfo.cv_city_id) {
                    userInfo.cv_city_id = userInfo.cv_city_id.toString();
                }
                const cv_cate_id = userInfo.cv_cate_id;
                if (userInfo.cv_cate_id) {
                    userInfo.cv_cate_id = userInfo.cv_cate_id.toString();
                }

                const getCvInfor = await SaveCvCandi.findOne({
                    uid: userInfo.use_id
                }).sort({ _id: -1 }).limit(1);

                userInfo.name_img = getCvInfor ? functions.imageCv(userInfo.use_create_time, getCvInfor.name_img) : "";
                userInfo.name_img_hide = getCvInfor ? functions.imageCv(userInfo.use_create_time, getCvInfor.name_img_hide) : "";

                // Cập nhật đường dẫn video
                if (userInfo.cv_video && userInfo.cv_video_type == 1) {
                    userInfo.cv_video = service.getUrlVideo(userInfo.use_create_time, userInfo.cv_video)
                }

                const getFileUpLoad = await Profile.findOne({
                    hs_link: { $ne: '' },
                    hs_use_id: userInfo.use_id,
                }).sort({ hs_active: -1, hs_id: -1 }).limit(1);

                let fileUpLoad = "";
                if (getFileUpLoad) {
                    fileUpLoad = {
                        hs_link: getFileUpLoad.hs_link,
                        hs_link_hide: getFileUpLoad.hs_link_hide,
                        hs_link_full: service.getUrlProfile(userInfo.use_create_time, getFileUpLoad.hs_link)
                    };
                }
                userInfo.fileUpLoad = fileUpLoad;

                let don_xin_viec,
                    thu_xin_viec,
                    syll;

                let checkStatus, statusSaveCandi = false;
                let list_apply = [];
                if (req.user && req.user.data.type == 1) {
                    let companyId = req.user.data.idTimViec365
                    let checkApplyForJob = await functions.getDatafindOne(applyForJob, { nhs_use_id: userId, nhs_com_id: companyId });
                    let checkPoint = await functions.getDatafindOne(pointUsed, { usc_id: companyId, use_id: userId });
                    const checkSaveCandi = await functions.getDatafindOne(SaveCandidate, { usc_id: companyId, use_id: userId });

                    if (checkSaveCandi) {
                        statusSaveCandi = true;
                    }

                    if (checkApplyForJob || checkPoint) {
                        checkStatus = true;
                        don_xin_viec = await SaveAppli.findOne({ uid: userId }, { name_img: 1 }).sort({ id: -1 }).limit(1).lean();
                        thu_xin_viec = await LetterUV.findOne({ uid: userId }, { name_img: 1 }).sort({ id: -1 }).limit(1).lean();
                        syll = await HoSoUV.findOne({ uid: userId }, { name_img: 1 }).sort({ id: -1 }).limit(1).lean();
                    } else {
                        userInfo.use_phone_tk = "Click để xem liên hệ";
                        userInfo.use_phone = "Click để xem liên hệ";
                        userInfo.use_email = "Click để xem liên hệ";
                        userInfo.use_email_lienhe = "Click để xem liên hệ";
                        checkStatus = false;
                    }
                } else if (req.user && req.user.data.idTimViec365 == userId) {
                    checkStatus = true;
                    if (!userInfo.candidate) {
                        await service.updateCandidate(userInfo.chat365_id);
                    }
                } else {
                    userInfo.use_phone_tk = "đăng nhập để xem sdt đăng kí";
                    userInfo.use_phone = "đăng nhập để xem sdt";
                    userInfo.use_email = "đăng nhập để xem email";
                    userInfo.use_email_lienhe = "đăng nhập để xem email liên hệ";
                    checkStatus = false;
                }

                // Blog
                let listBlog = [];
                if (cv_cate_id.length > 0 && cv_cate_id != 0 && cv_cate_id != null) {
                    const qr_tlq = await Category.findOne({ cat_id: cv_cate_id[0] }).select("cat_tlq_uv").lean();
                    if (qr_tlq && qr_tlq.cat_tlq_uv) {
                        const cat_tlq_uv = qr_tlq.cat_tlq_uv.split(',').map(Number);
                        listBlog = await blog.find({ new_id: { $in: cat_tlq_uv } }, {
                            new_id: 1,
                            new_title: 1,
                            new_title_rewrite: 1,
                            new_picture: 1,
                        }).lean();
                        for (let b = 0; b < listBlog.length; b++) {
                            const element = listBlog[b];
                            element.new_picture = functions.getPictureBlogTv365(element.new_picture)
                        }
                    }
                }

                return functions.success(res, "Hiển thị chi tiết ứng viên thành công", {
                    thong_tin: userInfo,
                    bang_cap,
                    ngoai_ngu,
                    kinh_nghiem,
                    don_xin_viec,
                    thu_xin_viec,
                    syll,
                    checkStatus,
                    statusSaveCandi,
                    listBlog
                });
            }
            return functions.setError(res, "Không có thông tin user", 400);
        }
        return functions.setError(res, "thông tin truyền lên không đầy đủ", 400);

    } catch (e) {
        console.log(e);
        return functions.setError(res, "Đã có lỗi xảy ra");
    }
}

// Tăng lượt xem cho ứng viên
exports.upView = async(req, res) => {
    try {
        const { use_id } = req.body;
        if (use_id) {
            const user = await Users.findOne({ idTimViec365: use_id, type: 0 }).limit(1).lean();
            if (user) {
                await Users.updateOne({ _id: user._id }, {
                    $set: {
                        "inForPerson.candidate.use_view": Number(user.inForPerson.candidate.use_view) + 1
                    }
                });
                return functions.success(res, "Tăng lượt view thành công");
            }
            return functions.setError(res, "Ứng viên không tồn tại");
        }
        return functions.setError(res, "Chưa truyền id ứng viên");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

//ứng viên ứng tuyển 
exports.candidateApply = async(req, res, next) => {
    try {
        const new_id = req.body.idtin,
            userID = req.user.data._id,
            use_id = req.user.data.idTimViec365;

        if (new_id) {
            const applyJob = await service.applyJob(new_id, use_id);
            if (applyJob) {
                return functions.success(res, "Nộp hồ sơ thành công");
            }
            return functions.setError(res, "Bạn đã ứng tuyển tin tuyển dụng");
        }
        return functions.setError(res, "Bạn chưa truyền id tin");
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi ứng tuyển", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

// Ứng viên ứng tuyển nhiều tin 1 lúc
exports.candidateApplyList = async(req, res) => {
    try {
        let list_id = req.body.list_id,
            userID = req.user.data._id,
            use_id = req.user.data.idTimViec365;

        if (list_id) {
            list_id = list_id.split(',').map(Number);
            for (let i = 0; i < list_id.length; i++) {
                const new_id = list_id[i];
                await service.applyJob(new_id, use_id);
            }
            return functions.success(res, "Nộp hồ sơ thành công");
        }
        return functions.setError(res, "Bạn chưa truyền danh sách tin");
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi ứng tuyển", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

exports.candidateSendLetterApply = async(req, res) => {
    try {
        const new_id = req.body.new_id,
            userID = req.user.data.idTimViec365,
            letterApply = req.body.content;

        if (new_id) {
            const checkApplyForJob = await applyForJob.findOne({
                    nhs_new_id: new_id,
                    nhs_use_id: userID,
                    nhs_kq: { $ne: 10 }
                })
                .select('nhs_id')
                .lean();

            if (checkApplyForJob) {
                await applyForJob.updateOne({ nhs_id: checkApplyForJob.nhs_id }, {
                    $set: {
                        nhs_thuungtuyen: letterApply
                    }
                });
                return functions.success(res, "Gửi thư ứng tuyển thành công");
            }
            return functions.setError(res, "Ứng viên chưa ứng tuyển tin tuyển dụng");
        }
        return functions.setError(res, "ID tin không tồn tại");
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//ứng viên lưu tin
exports.candidateSavePost = async(req, res, next) => {
    try {
        if (req.user && req.body.idtin) {
            let newId = req.body.idtin;
            let userId = req.user.data.idTimViec365;

            let checkNew = await functions.getDatafindOne(newTV365, { new_id: newId });
            //check xem có tin hay ko
            if (checkNew) {
                //check ứng viên đã lưu tin hay chưa
                let checkUserSavePost = await functions.getDatafindOne(userSavePost, { use_id: userId, new_id: newId });

                // Nếu lưu rồi thì xóa đi
                if (checkUserSavePost) {
                    await userSavePost.deleteOne({ use_id: userId, new_id: newId });
                    return functions.success(res, "Bỏ lưu tin thành công", { status: "unsave" });
                }
                // Còn không thì lưu lại
                else {
                    const maxID = await userSavePost.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
                    const newIDMax = Number(maxID.id) + 1;

                    let newUserSavePost = new userSavePost({
                        id: newIDMax,
                        use_id: userId,
                        new_id: newId,
                        saveTime: functions.getTimeNow(),
                    });

                    await newUserSavePost.save();
                    return functions.success(res, "ứng viên lưu tin ứng tuyển thành công", { status: "save" });
                }
            }
            return functions.setError(res, "Tin không tồn tại", 400);
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi ứng viên lưu tin ứng tuyển", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

exports.evaluateCompany = async(req, res) => {
    try {
        const userID = req.user.data.idTimViec365,
            com_id = req.body.com_id,
            content = req.body.content,
            now = functions.getTimeNow();
        if (com_id && content) {
            const type = 0;
            await service.evaluate(userID, com_id, type, content);
            return functions.success(res, "Đánh giá thành công");
        }
        return functions.setError(res, "Thiếu tham số");
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra");
    }
}

exports.list = async(req, res, next) => {
    try {
        const request = req.body,
            cate = Number(request.catid) || 0,
            city = Number(request.citid) || 0,
            page = Number(request.page) || 1,
            pageSize = Number(request.pageSize) || 20,
            skip = (page - 1) * pageSize,
            list_id = request.list_id;

        let condition = {
            type: 0,
            fromWeb: "timviec365",
            idTimViec365: { $ne: 0 },
            fromDevice: { $nin: [4, 7] },
            inForPerson: { $ne: null },
            "inForPerson.candidate.use_show": 1,
            "inForPerson.candidate.use_check": 1,
            "inForPerson.candidate.cv_title": { $ne: '' },
        };

        // Tìm kiếm ứng viên theo ngành nghề
        if (cate != 0) {
            condition = { "inForPerson.candidate.cv_cate_id": { $all: [cate] }, ...condition };
        }
        // Tìm kiếm ứng viên theo tỉnh thành
        if (city != 0) {
            condition = { "inForPerson.candidate.cv_city_id": { $all: [city] }, ...condition };
        }

        if (list_id) {
            condition = {
                idTimViec365: {
                    $in: list_id.split(',').map(Number)
                },
                type: 0,
                fromWeb: "timviec365",
            };
        }

        const list_ungvien = await Users.aggregate([
            { $match: condition },
            { $sort: { updatedAt: -1 } },
            { $limit: pageSize },
            {
                $project: {
                    _id: 0,
                    use_gioi_tinh: "$inForPerson.account.gender",
                    use_logo: "$avatarUser",
                    use_create_time: "$createdAt",
                    use_update_time: "$updatedAt",
                    use_first_name: "$userName",
                    use_id: "$idTimViec365",
                    chat365_id: "$_id",
                    cv_title: "$inForPerson.candidate.cv_title",
                    cv_city_id: "$inForPerson.candidate.cv_city_id",
                    use_quanhuyen: "$district",
                    use_city: "$city",
                    cv_exp: "$inForPerson.account.experience",
                    cv_hocvan: "$inForPerson.candidate.cv_hocvan",
                    isOnline: "$isOnline"
                }
            }
        ]);

        for (let i = 0; i < list_ungvien.length; i++) {
            const element = list_ungvien[i];
            if (element.use_city)
                element.use_city = element.use_city.toString();
        }

        // Đếm số ứng viên hiện có
        // const count = await functions.findCount(Users, condition);
        const count = 0;
        // Lấy thông tin seo
        const seo = await TblModules.findOne({
            module: "https://timviec365.vn/nguoi-tim-viec.html"
        }).lean();

        seo.sapo = await functions.renderCDNImage(seo.sapo);

        // Kiểm tra có đăng nhập hay không
        const user = await functions.getTokenUser(req, res);
        let total_tin = 0;
        let usc_city = 0;
        if (user && user.type == 1) {
            const findCompany = await Users.findOne({ _id: user._id }, { city: 1 }).lean();
            usc_city = findCompany.city;
        }
        return functions.success(res, "Danh sách ứng viên", {
            data: {
                list_ungvien,
                count,
                seo,
                total_tin,
                usc_city
            }
        });

    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

exports.list_tag_involved = async(req, res) => {
    try {
        const { title } = req.body;
        const list = await TagBlog.find({
            tag_count: { $ne: 3 },
            tag_key: { $in: title.split(',') }
        }).limit(20).lean();
        return functions.success(res, "Danh sách tag", {
            data: list
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra");
    }
}

exports.list_keyword_involved = async(req, res) => {
    try {
        const { key_cate_id, key_city_id } = req.body;
        let condition = {
            key_err: 0,
            key_name: { $ne: '' },
            key_qh_id: 0
        };

        if (key_cate_id) {
            condition.key_cate_id = key_cate_id;
        }
        if (key_city_id) {
            condition.key_city_id = key_city_id;
        }
        let list = await KeyWord.find(condition)
            .sort({ key_id: -1 })
            .limit(12)
            .lean();

        if (list.length == 0) {
            list = await KeyWord.find({
                    key_err: 0,
                    key_name: { $ne: '' },
                    key_qh_id: 0,
                    key_cate_id: 0,
                    key_city_id: 0,
                    key_cb_id: 0
                })
                .sort({ key_id: -1 })
                .limit(12)
                .lean();
        }
        return functions.success(res, "Danh sách tag", {
            data: list
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra");
    }
}

exports.setting_display = async(req, res) => {
    try {
        const user = req.user.data;
        const data = await Users.findOne({ _id: user._id }, { "inForPerson.candidate.use_show": 1 }).lean();
        await Users.updateOne({ _id: user._id }, {
            $set: {
                "inForPerson.candidate.use_show": Math.abs(Number(data.inForPerson.candidate.use_show) - 1),
                updatedAt: functions.getTimeNow()
            }
        });
        return functions.success(res, "Cập nhật thành công");
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã có lỗi xảy ra");
    }
}

exports.fastUploadProfile = async(req, res) => {
    try {
        const { phoneTK, password, name, emailContact, cv_title, cv_cate_id, cv_city_id, fromWeb, fromDevice } = req.body;
        const file = req.files;
        if (phoneTK && password && name && emailContact && cv_title && cv_cate_id && cv_city_id && file) {
            const user = await functions.getTokenUser();
            const now = functions.getTimeNow();

            // Nếu ứng viên chưa đăng nhập -> đăng ký tài khoản
            if (!user) {
                const findUser = await functions.getDatafindOne(Users, { phoneTK, type: { $ne: 1 } });
                if (!findUser) {

                    // Lấy id mới nhất
                    const getMaxUserID = await functions.getMaxUserID();
                    const now = functions.getTimeNow();
                    let data = {
                        _id: getMaxUserID._id,
                        phoneTK: phoneTK,
                        password: password,
                        userName: name,
                        phone: phoneTK,
                        type: 0,
                        emailContact: emailContact,
                        fromWeb: fromWeb,
                        fromDevice: fromDevice,
                        idTimViec365: getMaxUserID._idTV365,
                        idRaoNhanh365: getMaxUserID._idRN365,
                        idQLC: getMaxUserID._idQLC,
                        chat365_secret: Buffer.from(getMaxUserID._id.toString()).toString('base64'),
                        createdAt: now,
                        updatedAt: now,
                        inForPerson: {
                            candidate: {
                                cv_city_id: cv_city_id,
                                cv_cate_id: cv_cate_id,
                                cv_title: cv_title
                            }
                        }
                    };

                    // Nếu ứng viên hoàn thiện hồ sơ bằng cách tải video
                    // if (videoUpload && !videoLink && !cvUpload) {
                    //     data.inForPerson.candidate.cv_video = videoUpload[0].filename;
                    // }
                    // // Nếu ứng viên hoàn thiện hồ sơ bằng cách tải hồ sơ dạng ảnh pdf, png,..
                    // if (!videoUpload && !videoLink && cvUpload) {
                    //     dataUpload = {
                    //         hs_use_id: getMaxUserID._idTV365,
                    //         hs_name: cvUpload[0].originalname,
                    //         hs_link: cvUpload[0].filename,
                    //         hs_create_time: now
                    //     };
                    // }

                    let User = new Users(data)

                    // lưu ứng viên
                    await User.save();

                    // Tạo token
                    const token = await functions.createToken({
                        _id: getMaxUserID._id,
                        idTimViec365: getMaxUserID._idTV365,
                        idQLC: getMaxUserID._idQLC,
                        idRaoNhanh365: getMaxUserID._idRN365,
                        email: phone,
                        phoneTK: getMaxUserID.phoneTK,
                        createdAt: now,
                        type: 0,
                        com_id: 0
                    }, "1d");
                    // Trả về kết quả cho client
                    return functions.success(res, "Đăng kí thành công", { user_id: data.idTimViec365, access_token: token });
                }
                return functions.setError(res, "Tài khoản đã tồn tại");
            }
        }
        return functions.setError(res, "Chưa truyền đầy đủ thông tin");

    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
}