const Users = require('../../models/Users');
const blog = require('../../models/Timviec365/Blog/Posts');
const hoso = require('../../models/Timviec365/UserOnSite/Candicate/Profile');
const CVUV = require('../../models/Timviec365/CV/CVUV');
const donUV = require('../../models/Timviec365/CV/ApplicationUV');
const HoSoUV = require('../../models/Timviec365/CV/ResumeUV');
const ThuUV = require('../../models/Timviec365/CV/LetterUV');
const CV = require('../../models/Timviec365/CV/CV');
const like = require('../../models/Timviec365/CV/like');
const userUnset = require('../../models/Timviec365/UserOnSite/Candicate/UserUnset');
const newTV365 = require('../../models/Timviec365/UserOnSite/Company/New');
const applyForJob = require('../../models/Timviec365/UserOnSite/Candicate/ApplyForJob');
const userSavePost = require('../../models/Timviec365/UserOnSite/Candicate/UserSavePost');
const pointUsed = require('../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointUsed');
const CommentPost = require('../../models/Timviec365/UserOnSite/CommentPost');
const categoryBlog = require('../../models/Timviec365/Blog/Category');

//mã hóa mật khẩu
const md5 = require('md5');
//token
var jwt = require('jsonwebtoken');
const axios = require('axios');
const functions = require('../../services/functions');

const functionsBlog = require('../../services/serviceBlog');

const sendMail = require('../../services/sendMail');

const { token } = require('morgan');
const fs = require('fs');
const path = require('path');


exports.index = (req, res, next) => {
    res.json('123 123123123')
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
                let password = requestBody.password || null,
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
                if (!await functions.checkEmail(email)) {
                    email = null;
                }
                // && city && password && district  && candiCateID && candiCityID 
                if ((userName && email && candiTitle && address && fromWeb) != null) {
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
                    const token = await functions.createToken(requestBody, "1d");
                    functions.success(res, 'Đăng ký bước 1 thành công', { user_info: requestBody._id, token })
                } else {
                    console.log(password, userName, email, city, district, address, candiCateID, candiCityID, candiTitle);
                    functions.setError(res, "Thiếu tham số đầu vào");
                }
            } else {
                await functions.setError(res, "Tài khoản đã được đăng ký");
            }
        } else {
            await functions.setError(res, "Số điện thoại không được trống");
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
                        birthday: birthday,
                        createdAt: new Date(Date.now()),
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
                        birthday: birthday,
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
        if (req && req.body && req.files) {
            const birthday = req.body.birthday;
            const exp = req.body.exp;
            const candiHocVan = req.body.candiHocVan;
            const candiSchool = req.body.candiSchool;
            const fileUpload = req.files;
            const videoLink = req.body.videoLink;
            const phoneTK = req.user.data.phoneTK;
            const password = req.user.data.password;
            const userName = req.user.data.userName;
            const email = req.user.data.email;
            const city = req.user.data.city;
            const district = req.user.data.district;
            const address = req.user.data.address;
            const fromDevice = req.user.data.uRegis;
            const fromWeb = req.user.data.fromWeb;
            const candiCateID = req.user.data.candiCateID.split(",").map(Number);
            const candiCityID = req.user.data.candiCityID.split(",").map(Number);
            const candiTitle = req.user.data.candiTitle;
            const type = req.user.data.type;
            let cvUpload, videoUpload;

            if (!fileUpload.cvUpload && !fileUpload.video) {
                return await functions.setError(res, "Chưa tải cv hoặc video hoàn thiện hồ sơ", 200)
            }
            if (fileUpload.cvUpload) {
                cvUpload = fileUpload.cvUpload;
            }
            if (fileUpload.videoUpload) {
                videoUpload = fileUpload.videoUpload;
                if (videoUpload.size > (100 * 1024 * 1024)) {
                    return await functions.setError(res, "dung lượng file vượt quá 100MB", 200)
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
                    idTimViec365: getMaxUserID._idTV365,
                    idRaoNhanh365: getMaxUserID._idRN365,
                    idQLC: getMaxUserID._idQLC,
                    createdAt: new Date(Date.now()),
                    updatedAt: new Date(Date.now()),
                    birthday: birthday,
                    inForPerson: {
                        user_id: 0,
                        candiCateID: candiCateID,
                        candiCityID: candiCityID,
                        candiTitle: candiTitle,
                        exp: exp,
                        candiHocVan: candiHocVan,
                        candiSchool: candiSchool,
                        videoType: videoType
                    }
                };

                // Nếu ứng viên hoàn thiện hồ sơ bằng cách tải video
                if (videoUpload && !videoLink && !cvUpload) {
                    data.inForPerson.video = videoUpload[0].filename;
                }
                // Nếu ứng viên hoàn thiện hồ sơ bằng cách tải video dạng link
                if (videoLink && !videoUpload && !cvUpload) {
                    data.inForPerson.video = videoLink;
                }
                // Nếu ứng viên hoàn thiện hồ sơ bằng cách tải hồ sơ dạng ảnh pdf, png,..
                if (!videoUpload && !videoLink && cvUpload) {
                    data.inForPerson.cv = cvUpload[0].filename;
                }
                // Nếu ứng viên hoàn thiện hồ sơ bằng cách tải hồ sơ dạng ảnh pdf, png,.. và tải kèm video dạng file.
                if (videoUpload && !videoLink && cvUpload) {
                    data.inForPerson.cv = cvUpload[0].filename;
                    data.inForPerson.video = videoUpload[0].filename;
                }
                // Nếu ứng viên hoàn thiện hồ sơ bằng cách tải hồ sơ dạng ảnh pdf, png,.. và tải kèm video dạng link.
                if (!videoUpload && videoLink && cvUpload) {
                    data.inForPerson.cv = cvUpload[0].filename;
                    data.inForPerson.video = videoLink;
                }
                let User = new Users(data)
                await User.save();
                await userUnset.findOneAndDelete({ usePhoneTk: phoneTK });
                return functions.success(res, "Đăng kí thành công", { user_id: data.idTimViec365 })
            }
        } else return functions.setError(res, "Thông tin truyền lên không đầy đủ", 200);
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi đăng kí", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 200)
    }


}

//đăng kí = cách làm cv trên site
exports.RegisterB2CvSite = async(req, res, next) => {
    try {
        if (req && req.body) {
            const phoneTK = req.user.data.phoneTK;
            const password = req.user.data.password;
            const userName = req.user.data.userName;
            const email = req.user.data.email;
            const city = req.user.data.city;
            const district = req.user.data.district;
            const address = req.user.data.address;
            const fromDevice = req.user.data.uRegis;
            const fromWeb = req.user.data.fromWeb;
            const candiCateID = req.user.data.candiCateID.split(",").map(Number);
            const candiCityID = req.user.data.candiCityID.split(",").map(Number);
            const candiTitle = req.user.data.candiTitle;
            const type = req.user.data.type;

            let findUser = await functions.getDatafindOne(Users, { phoneTK: phoneTK, type: { $ne: 1 } })
            if (findUser && findUser.phoneTK && findUser.phoneTK == phoneTK) {
                return functions.setError(res, "Số điện thoại này đã được đăng kí", 200);
            }

            // Lấy id mới nhất
            const getMaxUserID = await functions.getMaxUserID();
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
                idTimViec365: getMaxUserID._idTV365,
                idRaoNhanh365: getMaxUserID._idRN365,
                idQLC: getMaxUserID._idQLC,
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now()),
                birthday: birthday,
                inForPerson: {
                    user_id: 0,
                    candiCateID: candiCateID,
                    candiCityID: candiCityID,
                    candiTitle: candiTitle,
                }
            };
            let User = new Users(data)
            await User.save();
            await userUnset.findOneAndDelete({ usePhoneTk: phoneTK });
            return functions.success(res, "Đăng kí thành công", { user_id: data.idTimViec365 });

        } else return functions.setError(res, "Thông tin truyền lên không đầy đủ", 200);
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi đăng kí", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 200)
    }
}

// b1: gửi mã otp tới tên tài khoản được nhập
exports.sendOTP = async(req, res, next) => {
    try {
        const user = req.body.user;
        if (await functions.checkPhoneNumber(user) && await functions.getDatafindOne(Users, { phoneTK: user })) {
            await functions.getDataAxios("http://43.239.223.142:9000/api/users/RegisterMailOtp", { user })
                .then((response) => {

                    const otp = response.data.otp;
                    if (otp) {
                        return Users.updateOne({ phoneTK: user }, {
                            $set: {
                                otp: otp
                            }
                        });
                    }
                    functions.setError(res, "Gửi OTP lỗi 1", );
                })
                .then(() => {
                    functions.getDatafindOne(Users, { phoneTK: user }, )
                        .then(async(response) => {
                            const token = await functions.createToken(response, '30m'); // tạo token chuyển lên headers
                            res.setHeader('authorization', `Bearer ${token}`);
                            return functions.success(res, 'Gửi OTP thành công');
                        });
                });
        } else if (await functions.checkEmail(user) && await functions.getDatafindOne(Users, { email: user }, )) {
            await functions.getDataAxios("http://43.239.223.142:9000/api/users/RegisterMailOtp", { user })
                .then((response) => {
                    const otp = response.data.otp;
                    if (otp) {
                        return Users.updateOne({ email: user }, {
                            $set: {
                                otp: otp
                            }
                        });
                    }
                    functions.setError(res, 'Gửi OTP lỗi 2', );
                })
                .then(() => {
                    Users.findOne({ email: user })
                        .then(async(response) => {
                            const token = await functions.createToken(response, '30m');
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
        const verify = await Users.findOne({ _id: _id, otp }); // tìm user với dk có otp === otp người dùng nhập

        if (verify) {
            const token = await functions.createToken(verify, '30m');
            res.setHeader('authorization', `Bearer ${token}`);
            return functions.success(res, 'Xác thực OTP thành công', { access_token });
        } else {
            return functions.setError(res, "Otp không chính xác", 404);
        }
    } catch (e) {
        return functions.setError(res, 'Xác nhận OTP lỗi', );
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
        return functions.setError(res, 'Đổi mật khẩu lỗi', 404);
    } catch (e) {
        return functions.setError(res, 'Đổi mật khẩu lỗi', );
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

        } else if (await functions.checkEmail(user) && await functions.getDatafindOne(Users, { email: user, type: type }, )) {
            await functions.getDataAxios("http://43.239.223.142:9000/api/users/RegisterMailOtp", { user })
                .then((response) => {
                    const otp = response.data.otp;
                    if (otp) {
                        return Users.updateOne({ email: user, type: type }, {
                            $set: {
                                otp: otp
                            }
                        });
                    }
                    functions.setError(res, 'Gửi OTP lỗi 2', );
                })
                .then(() => {
                    Users.findOne({ email: user, type: type })
                        .then(async(response) => {
                            const token = await functions.createToken(response, '30m');
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

//ứng viên đăng nhập
exports.loginUv = async(req, res, next) => {
    try {
        if (req.body.account && req.body.password) {
            const type = 0;
            const account = req.body.account;
            const password = req.body.password;

            let checkPhoneNumber = await functions.checkPhoneNumber(account);
            if (checkPhoneNumber) {
                var findUser = await functions.getDatafindOne(Users, { phoneTK: account, type: { $ne: 1 } });
            } else {
                var findUser = await functions.getDatafindOne(Users, { email: account, type: { $ne: 1 } });
            }

            if (!findUser) {
                return functions.setError(res, "Không tồn tại tài khoản", 200)
            }
            let checkPassword = await functions.verifyPassword(password, findUser.password)
            if (!checkPassword) {
                return functions.setError(res, "Mật khẩu sai", 200)
            }

            const token = await functions.createToken(findUser, "2d");
            return functions.success(res, 'Đăng nhập thành công', { token, authentic: findUser.authentic, user_id: findUser.idTimViec365 });
        }
    } catch (e) {
        return functions.setError(res, "Đã có lỗi xảy ra", )
    }

}

// trang qlc trong hoàn thiện hồ sơ
exports.completeProfileQlc = async(req, res, next) => {
    try {
        let phoneTK = String(req.user.data.phoneTK)
        let newAI = []
        let newCv = []
        let newBlog = []

        let userId = req.user.data.idTimViec365
        console.log(userId)
        let candiCateID = Number(req.user.data.inForPerson.candiCateID[0])
        let candiCityID = Number(req.user.data.inForPerson.candiCityID[0])
        let takeData
            //việc làm AI
        try {
            takeData = await axios({
                method: "post",
                url: "http://43.239.223.10:4001/recommendation_tin_ungvien",
                data: {
                    site_job: "timviec365",
                    site_uv: "uvtimviec365",
                    new_id: candiCateID,
                    size: 20,
                    pagination: 1,
                },
                headers: { "Content-Type": "multipart/form-data" }
            });
        } catch (e) {
            console.log(e)
            return functions.setError(res, "api AI lỗi", )
        }
        let listNewId = takeData.data.data.list_id.split(",")
        for (let i = 0; i < listNewId.length; i++) {
            listNewId[i] = Number(listNewId[i])
        }

        let post = await newTV365.aggregate([{
                $match: {
                    _id: { $in: listNewId },
                }
            },
            {
                $lookup: {
                    from: "Users",
                    localField: "userID",
                    foreignField: "idTimViec365",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $skip: 0
            },
            {
                $project: {
                    usc_company: '$user.userName',
                    usc_logo: '$user.avatarUser',
                    new_title: '$title',
                    new_city: '$cityID',
                    new_han_nop: '$hanNop',
                    new_hot: '$newHot',
                    money: '$money',
                    nm_type: '$newMoney.type',
                    nm_id: '$newMoney.id',
                    nm_min_value: '$newMoney.minValue',
                    nm_max_value: '$newMoney.maxValue',
                    nm_unit: '$newMoney.unit',
                }
            },
        ]);

        for (let i = 0; i < post.length; i++) {
            post[i].new_money = await functions.new_money_tv(post[i].nm_id, post[i].nm_type, post[i].nm_unit, post[i].nm_min_value, post[i].nm_max_value, post[i].money)
            delete post[i].money
            delete post[i].nm_type
            delete post[i].nm_id
            delete post[i].nm_min_value
            delete post[i].nm_max_value
            delete post[i].nm_unit
        }


        //Mẫu Cv của tôi
        let myCv = await CVUV.aggregate([{
                $match: {
                    userId: userId
                }
            },
            {
                $lookup: {
                    from: "CV",
                    localField: "cvId",
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
            myCv[i].img = `upload/ungvien/uv_${userId}/${myCv[i].img}`
            myCv[i].img = await functions.hostCv(myCv[i].img)
            myCv[i].link_edit = await functions.hostCv(myCv[i].link_edit)
            myCv[i].link_dowload = `download-cvpdf/cv.php?cvid=${ myCv[i].cv_id}&uid=${userId}&cvname=${myCv[i].title}`
            myCv[i].link_dowload = await functions.hostCv(myCv[i].link_dowload)
        }
        //Mẫu CV đề xuất
        let findCv = await CV.find({}, { image: 1, alias: 1 }).sort({ _id: -1 }).limit(10)

        for (let i = 0; i < findCv.length; i++) {
            text = `upload/cv/thumb/${findCv[i].image}`
            findCv[i].image = await functions.hostCv(text)
            findCv[i].alias = await functions.hostCv(findCv[i].alias)
        }

        //số việc làm đã ứng tuyển
        let listJobUv = await functions.getDatafind(applyForJob, { userID: userId })

        //việc làm phù hợp
        let listJobFit = await newTV365.find({ cateID: 1, cityID: 1 }, { _id: 1 })

        //nhà tuyển dụng xem hồ sơ
        let ntdCheckHoso = await functions.getDatafind(pointUsed, { useID: candiCateID, type: candiCateID })


        let itesm_dem = {
            "ut": listJobUv.length,
            'vl': listJobFit.length,
            'ntd': ntdCheckHoso.length
        }

        let myBlog = await blog.aggregate([{
                $match: {
                    categoryID: candiCateID
                }
            },
            {
                $lookup: {
                    from: "CategoryBlog",
                    localField: "categoryID",
                    foreignField: "_id",
                    as: "cate"
                }
            },
            {
                $unwind: "$cate"
            },
            {
                $skip: 0
            },
            {
                $project: {
                    name: '$cate.name',
                    link: '$titleRewrite',
                    img: '$picture',
                    title: '$title'
                }
            },
        ]);

        let itesm_qc = {}
        itesm_qc.name = myBlog[0].name
        itesm_qc.items = []

        for (let i = 0; i < myBlog.length; i++) {
            myBlog[i].link = await functionsBlog.hostBlog(myBlog[i].link, myBlog[i]._id)
            myBlog[i].img = await functions.getPictureBlogTv365(myBlog[i].img)
            itesm_qc.items.push(myBlog[i])
        }
        const newData = {...itesm_qc }; // Tạo bản sao của đối tượng data
        newData.items = newData.items.map(item => {
            const newItem = {...item }; // Tạo bản sao của phần tử
            delete newItem.name; // Xóa trường name trong phần tử
            return newItem;
        });

        functions.success(res, "Hiển thị qlc thành công", { itesm_vl: post, itesm_cv: myCv, itesm_cvdx: findCv, itesm_dem, itesm_qc })
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }

}

// danh sách cv xin việc và cv yêu thích của ứng viên
exports.cvXinViec = async(req, res, next) => {
    try {
        if (req.user) {
            let page = Number(req.body.page)
            let pageSize = Number(req.body.pageSize)
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let userId = req.user.data.idTimViec365
            let findCvUv = await functions.pageFind(CVUV, { userId }, { _id: 1 }, skip, limit)
            const totalCount = await CVUV.countDocuments({ userId: userId })
            const totalPages = Math.ceil(totalCount / pageSize)

            let findFavorCvUv = await functions.pageFind(like, { userId: userId, type: 1 }, { _id: 1 }, skip, limit)
            const totalCountFavor = await like.countDocuments({ userId: userId, type: 1 })
            const totalPagesFavor = Math.ceil(totalCountFavor / pageSize)
            if (findCvUv) {
                functions.success(res, "Hiển thị những CV Đã tạo và yêu thích thành công", { CVUV: { totalCount, totalPages, listCv: findCvUv }, CVUVFavor: { totalCountFavor, totalPagesFavor, listCvFavor: findFavorCvUv } });
            }
        } else {
            return functions.setError(res, "Token không hợp lệ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

// danh sách đơn xin việc và đơn yêu thích của ứng viên
exports.donXinViec = async(req, res, next) => {
    try {
        if (req.user) {
            let page = Number(req.body.page)
            let pageSize = Number(req.body.pageSize)
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let userId = req.user.data.idTimViec365
            let findDonUv = await functions.pageFind(donUV, { userId }, { _id: 1 }, skip, limit)
            const totalCount = await donUV.countDocuments({ userId: userId })
            const totalPages = Math.ceil(totalCount / pageSize)

            let findFavorDonUv = await functions.pageFind(like, { userId: userId, type: 3 }, { _id: 1 }, skip, limit)
            const totalCountFavor = await like.countDocuments({ userId: userId, type: 3 })
            const totalPagesFavor = Math.ceil(totalCountFavor / pageSize)
            if (findDonUv) {
                functions.success(res, "Hiển thị những đơn xin việc Đã tạo và yêu thích thành công", { donUV: { totalCount, totalPages, listDon: findDonUv }, donUVFavor: { totalCountFavor, totalPagesFavor, listDonFavor: findFavorDonUv } });
            }
        } else {
            return functions.setError(res, "Token không hợp lệ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

// danh sách thư xin việc và thư yêu thích của ứng viên
exports.thuXinViec = async(req, res, next) => {
    try {
        if (req.user) {
            let page = Number(req.body.page)
            let pageSize = Number(req.body.pageSize)
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let userId = req.user.data.idTimViec365
            let findThuUv = await functions.pageFind(ThuUV, { userId }, { _id: 1 }, skip, limit)
            const totalCount = await ThuUV.countDocuments({ userId: userId })
            const totalPages = Math.ceil(totalCount / pageSize)

            let findFavorThuUv = await functions.pageFind(like, { userId: userId, type: 0 }, { _id: 1 }, skip, limit)
            const totalCountFavor = await like.countDocuments({ userId: userId, type: 0 })
            const totalPagesFavor = Math.ceil(totalCountFavor / pageSize)
            if (findThuUv) {
                functions.success(res, "Hiển thị những Thư xin việc Đã tạo và yêu thích thành công", { ThuUV: { totalCount, totalPages, listThu: findThuUv }, ThuUVFavor: { totalCountFavor, totalPagesFavor, listThuFavor: findFavorThuUv } });
            }
        } else {
            return functions.setError(res, "Token không hợp lệ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
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

//danh sách tin ứng tuyển ứng viên đã ứng tuyển
exports.listJobCandidateApply = async(req, res, next) => {
    try {
        if (req.user) {
            let page = Number(req.body.page) || 1,
                pageSize = Number(req.body.pageSize) || 10,
                userId = req.user.data.idTimViec365,
                match = {
                    userID: userId,
                    kq: { $nin: [10, 11, 12, 14] }
                },
                total = 0;
            const skip = (page - 1) * pageSize;

            let listJobUv = await applyForJob.aggregate([{
                    $match: match
                },
                {
                    $lookup: {
                        from: "Users",
                        localField: "comID",
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
                    $lookup: {
                        from: "NewTV365",
                        localField: "newID",
                        foreignField: "_id",
                        as: "new"
                    }
                },
                {
                    $unwind: "$new"
                },
                {
                    $project: {
                        new_id: "$new._id",
                        new_title: "$new.title",
                        new_alias: "$new.alias",
                        new_han_nop: "$new.hanNop",
                        usc_id: "$user.idTimViec365",
                        usc_company: "$user.userName",
                        usc_alias: "$user.alias",
                        nhs_time: "$time",
                        nhs_kq: "$kq"
                    }
                },
                {
                    $sort: {
                        time: -1
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
                        $lookup: {
                            from: "Users",
                            localField: "comID",
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
                        $lookup: {
                            from: "NewTV365",
                            localField: "newID",
                            foreignField: "_id",
                            as: "new"
                        }
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

            return await functions.success(res, "Lấy thông tin thành công", { items: listJobUv, total });
        } else {
            return functions.setError(res, "Token không hợp lệ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//danh sách tin ứng tuyển ứng viên đã lưu
exports.listJobCandidateSave = async(req, res, next) => {
    try {
        if (req.user) {
            let page = Number(req.body.page) || 1,
                pageSize = Number(req.body.pageSize) || 10,
                userId = req.user.data.idTimViec365,
                total = 0;
            const skip = (page - 1) * pageSize;

            let listJobUvSave = await userSavePost.aggregate([{
                    $match: {
                        userID: userId
                    }
                },
                {
                    $lookup: {
                        from: "NewTV365",
                        localField: "newID",
                        foreignField: "_id",
                        as: "new"
                    }
                },
                {
                    $unwind: "$new"
                },
                {
                    $lookup: {
                        from: "Users",
                        localField: "new.userID",
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
                        new_id: "$new._id",
                        new_title: "$new.title",
                        new_alias: "$new.alias",
                        new_han_nop: "$new.hanNop",
                        new_active: "$new.active",
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
                            userID: userId
                        }
                    },
                    {
                        $lookup: {
                            from: "NewTV365",
                            localField: "newID",
                            foreignField: "_id",
                            as: "new"
                        }
                    },
                    {
                        $unwind: "$new"
                    },
                    {
                        $lookup: {
                            from: "Users",
                            localField: "new.userID",
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

            return await functions.success(res, "Hiển thị những việc làm ứng viên đã ứng tuyển thành công", { item: listJobUvSave, total });
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
            userId = req.user.data.idTimViec365,
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

            let data = {
                userName: userName,
                phone: phone,
                address: address,
                city: city,
                district: district,
                updatedAt: new Date(Date.now()),
                "inForPerson.birthday": birthday,
                "inForPerson.gender": gender,
                "inForPerson.married": married
            };

            if (avatarUser) {
                data.avatarUser = avatarUser.filename;
            }


            await Users.updateOne({ idTimViec365: userId, type: { $ne: 1 } }, {
                $set: data
            });
            functions.success(res, "Cập nhật thông tin liên hệ thành công,");
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Cập nhật thông tin liên hệ", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật công việc mong muốn
exports.updateDesiredJob = async(req, res, next) => {
    try {
        let userId = req.user.data.idTimViec365,
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
            await Users.updateOne({ idTimViec365: userId, type: { $ne: 1 } }, {
                $set: {
                    updatedAt: new Date(Date.now()),
                    "inForPerson.candiCateID": candiCateID,
                    "inForPerson.exp": exp,
                    "inForPerson.candiCapBac": candiCapBac,
                    "inForPerson.candiTitle": candiTitle,
                    "inForPerson.candiLoaiHinh": candiLoaiHinh,
                    "inForPerson.candiCityID": candiCityID,
                    "inForPerson.candiMoney": candiMoney,
                    "inForPerson.candiMoneyUnit": candiMoneyUnit,
                    "inForPerson.candiMoneyType": candiMoneyType,
                    "inForPerson.candiMoneyMin": candiMoneyMin || null,
                    "inForPerson.candiMoneyMax": candiMoneyMax || null
                }
            });

            await functions.success(res, "Cập nhật thông tin công việc mong muốn thành công");
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

            let userId = req.user.data.idTimViec365
            let candiMucTieu = req.body.muctieu;

            await Users.updateOne({ idTimViec365: userId, type: { $ne: 1 } }, {
                $set: {
                    updatedAt: new Date(Date.now()),
                    "inForPerson.candiTarget": candiMucTieu,
                }
            });
            return await functions.success(res, "Cập nhật mục tiêu nghề nghiệp thành công");
        } else {
            return await functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật kỹ năng bản thân
exports.updateSkills = async(req, res, next) => {
    try {
        if (req.user && req.body.kynang) {
            let userId = req.user.data.idTimViec365;
            let candiSkills = req.body.kynang;

            await Users.updateOne({ idTimViec365: userId, type: { $ne: 1 } }, {
                $set: {
                    updatedAt: new Date(Date.now()),
                    "inForPerson.candiSkills": candiSkills,
                }
            });
            return await functions.success(res, "Cập nhật kỹ năng nghề nghiệp thành công");
        } else {
            return await functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật kỹ năng bản thân", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật thông tin người tham chiếu
exports.updateReferencePersonInfo = async(req, res, next) => {
    try {
        if (req.user && req.body.referencePersonName && req.body.referencePersonEmail &&
            req.body.referencePersonPhone && req.body.referencePersonPosition && req.body.referencePersonCompany) {

            let userId = req.user.data.idTimViec365
            let referencePersonName = req.body.referencePersonName
            let referencePersonEmail = req.body.referencePersonEmail
            let referencePersonPhone = req.body.referencePersonPhone
            let referencePersonPosition = req.body.referencePersonPosition
            let referencePersonCompany = req.body.referencePersonCompany
            let updateUser = await functions.findOneAndUpdateUser(userId, {
                inForPerson: {
                    referencePersonName: referencePersonName,
                    referencePersonEmail: referencePersonEmail,
                    referencePersonPhone: referencePersonPhone,
                    referencePersonPosition: referencePersonPosition,
                    referencePersonCompany: referencePersonCompany,
                }
            })
            if (updateUser) {
                functions.success(res, "Cập nhật Thông tin người tham chiếu thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật kỹ năng bản thân", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//Cập nhật video giới thiệu
exports.updateIntroVideo = async(req, res, next) => {
    try {
        if (req.user) {
            let userId = req.user.data.idTimViec365
            let videoLink = req.body.videoLink
            if (req.file && !videoLink) {
                let videoName = req.file.filename
                let updateUser = await functions.findOneAndUpdateUser(userId, {
                    inForPerson: {
                        video: videoName,
                        videoType: 0
                    }
                })
                if (updateUser) {
                    functions.success(res, "Cập nhật Video giới thiệu bản thân thành công");
                }
            } else if (!req.body.file && videoLink) {
                let updateUser = await functions.findOneAndUpdateUser(userId, {
                    inForPerson: {
                        video: videoLink,
                        videoType: 1
                    }
                })
                if (updateUser) {
                    functions.success(res, "Cập nhật Video giới thiệu bản thân thành công");
                }
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật video giới thiệu", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//Thêm dữ liệu bằng cấp học vấn
exports.addDegree = async(req, res, next) => {
    try {
        if (req.user && req.body.bc && req.body.truonghoc && req.body.chuyennganh && req.body.xeploai && req.body.bosungth && req.body.onetime && req.body.twotime) {

            let userId = req.user.data.idTimViec365
            let degree = req.body.bc
            let school = req.body.truonghoc
            let major = req.body.chuyennganh
            let rate = req.body.xeploai
            let implement = req.body.bosungth
            let start = req.body.onetime
            let end = req.body.twotime
            const maxID = await Users.findOne({ idTimViec365: userId }, { "inForPerson.candiDegree.id": 1 }).sort({ "inForPerson.candiDegree.id": -1 }).limit(1).lean();
            if (maxID.inForPerson.candiDegree[0]) {
                newID = Number(maxID.inForPerson.candiDegree[maxID.inForPerson.candiDegree.length - 1].id + 1);
            } else newID = 1
            let addDegree = {
                id: newID,
                degree,
                school,
                major,
                rate,
                implement,
                start,
                end
            }

            let updateUser = await functions.findOneAndUpdateUser(userId, {
                $push: {
                    "inForPerson.candiDegree": addDegree
                }
            })
            if (updateUser) {
                functions.success(res, "Thêm bằng cấp học vấn thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi thêm bằng cấp học vấn", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật bằng cấp học vấn
exports.updateDegree = async(req, res, next) => {
    try {
        if (req.user && req.body.bc && req.body.truonghoc && req.body.chuyennganh && req.body.xeploai && req.body.bosungth && req.body.onetime && req.body.twotime && req.body.idhv) {

            let userId = req.user.data.idTimViec365
            let degree = req.body.bc
            let school = req.body.truonghoc
            let major = req.body.chuyennganh
            let rate = req.body.xeploai
            let implement = req.body.bosungth
            let start = req.body.onetime
            let end = req.body.twotime
            let id = Number(req.body.idhv)
            let updateDegree = {
                id: id,
                degree,
                school,
                major,
                rate,
                implement,
                start,
                end
            }

            let updateUser = await Users.findOneAndUpdate({
                $or: [{
                        idTimViec365: userId,
                        type: 0,
                        "inForPerson.candiDegree.id": id
                    },
                    {
                        idTimViec365: userId,
                        type: 2,
                        "inForPerson.candiDegree.id": id
                    },
                ]
            }, {
                $set: {
                    "inForPerson.candiDegree.$": updateDegree
                },
            })
            if (updateUser) {
                functions.success(res, "Cập nhật bằng cấp học vấn thành công");
            } else {
                return functions.setError(res, "Lỗi", 400);
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật bằng cấp học vấn", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//xóa bằng cấp học vấn
exports.deleteDegree = async(req, res, next) => {
    try {
        if (req.user && req.body.bc && req.body.truonghoc && req.body.chuyennganh && req.body.xeploai && req.body.bosungth && req.body.onetime && req.body.twotime && req.body.idhv) {

            let userId = req.user.data.idTimViec365
            let degree = req.body.bc
            let school = req.body.truonghoc
            let major = req.body.chuyennganh
            let rate = req.body.xeploai
            let implement = req.body.bosungth
            let start = req.body.onetime
            let end = req.body.twotime
            let id = Number(req.body.idhv)
            let deleteDegree = {
                id: id,
                degree,
                school,
                major,
                rate,
                implement,
                start,
                end
            }

            let updateUser = await Users.findOneAndUpdate({
                $or: [{
                        idTimViec365: userId,
                        type: 0,
                        "inForPerson.candiDegree.id": id
                    },
                    {
                        idTimViec365: userId,
                        type: 2,
                        "inForPerson.candiDegree.id": id
                    },
                ]
            }, {
                $pull: {
                    "inForPerson.candiDegree.$": deleteDegree
                },
            })
            if (updateUser) {
                functions.success(res, "Xóa bằng cấp học vấn thành công");
            }
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
            let userId = req.user.data.idTimViec365
            let updateUser = await functions.findOneAndUpdateUser(userId, {
                updatedAt: new Date(Date.now())
            })
            if (updateUser) {
                functions.success(res, "Làm mới hồ sơ thành công");
            }
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
        if (req.user) {
            let userId = req.user.data.idTimViec365
            if (req.file) {
                let imageName = req.file.filename
                let updateUser = await functions.findOneAndUpdateUser(userId, {
                    avatarUser: imageName
                })
                if (updateUser) {
                    functions.success(res, "Cập nhật ảnh đại diện thành công");
                }
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật ảnh đại diện", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//tải hồ sơ của tôi lên (cv)
exports.upLoadHoSo = async(req, res, next) => {
    try {
        if (req.user && req.body.cvname) {
            let userId = req.user.data.idTimViec365
            let nameHoSo = req.body.nameHoSo
            if (req.file) {
                const targetDirectory = `public/candidate/${userId}`;
                // Đặt lại tên file
                const originalname = req.file.originalname;
                const extension = originalname.split('.').pop();
                const uniqueSuffix = Date.now();
                const newFilename = nameHoSo + uniqueSuffix + '.' + extension;

                // Đường dẫn tới file cũ
                const oldFilePath = req.file.path;

                // Đường dẫn tới file mới
                const newFilePath = path.join(targetDirectory, newFilename);

                // Di chuyển file và đổi tên file
                fs.rename(oldFilePath, newFilePath, async function(err) {
                    if (err) {
                        console.error(err);
                        return functions.setError(res, "Lỗi khi đổi tên file", 400);
                    }
                })

                const maxID = await hoso.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                if (maxID) {
                    newID = Number(maxID._id) + 1;
                } else newID = 1

                let findhoso = await functions.getDatafind(hoso, { userId })
                if (findhoso.length < 3) {
                    let hosoUv = new hoso({
                        _id: newID,
                        userId: userId,
                        name: newFilename,
                        createTime: new Date(Date.now()),
                    })
                    let savehosoUv = hosoUv.save()
                    findhoso.push(hosoUv)
                    if (savehosoUv) {
                        functions.success(res, "Tải lên hồ sơ thành công", findhoso);
                    }

                } else return functions.setError(res, "Bạn chỉ có thể upload tối đa 3 hồ sơ", 400);
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi tải lên hồ sơ", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//Thêm dữ liệu Ngoại ngữ tin học
exports.addNgoaiNgu = async(req, res, next) => {
    try {
        if (req.user && req.body.chungchi && req.body.sodiem && req.body.ngoaingu) {

            let userId = req.user.data.idTimViec365
            let chungChi = req.body.chungchi
            let point = req.body.sodiem
            let ngoaiNgu = req.body.ngoaingu

            const maxID = await Users.findOne({ idTimViec365: userId }, { "inForPerson.candiNgoaiNgu.id": 1 }).sort({ "inForPerson.candiNgoaiNgu.id": -1 }).limit(1).lean();
            if (maxID.inForPerson.candiNgoaiNgu[0]) {
                newID = Number(maxID.inForPerson.candiNgoaiNgu[maxID.inForPerson.candiNgoaiNgu.length - 1].id + 1);
            } else newID = 1
            let addNgoaiNgu = {
                id: newID,
                chungChi,
                point,
                ngoaiNgu,
            }

            let updateUser = await functions.findOneAndUpdateUser(userId, {
                $push: {
                    "inForPerson.candiNgoaiNgu": addNgoaiNgu
                }
            })
            if (updateUser) {
                functions.success(res, "Thêm ngoại ngữ thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi thêm ngoại ngữ", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật Ngoại ngữ tin học
exports.updateNgoaiNgu = async(req, res, next) => {
    try {
        if (req.user && req.body.chungchi && req.body.sodiem && req.body.ngoaingu && req.body.idnn) {

            let userId = req.user.data.idTimViec365
            let chungChi = req.body.chungchi
            let point = req.body.sodiem
            let ngoaiNgu = req.body.ngoaingu
            let id = Number(req.body.idnn)
            let updateNgoaiNgu = {
                id: id,
                chungChi,
                point,
                ngoaiNgu,
            }

            let updateUser = await Users.findOneAndUpdate({
                $or: [{
                        idTimViec365: userId,
                        type: 0,
                        "inForPerson.candiNgoaiNgu.id": id
                    },
                    {
                        idTimViec365: userId,
                        type: 2,
                        "inForPerson.candiNgoaiNgu.id": id
                    },
                ]
            }, {
                $set: {
                    "inForPerson.candiNgoaiNgu.$": updateNgoaiNgu
                },
            })
            if (updateUser) {
                functions.success(res, "Cập nhật ngoại ngữ thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật ngoại ngữ", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//xóa Ngoại ngữ tin học
exports.deleteNgoaiNgu = async(req, res, next) => {
    try {
        if (req.user && req.body.chungchi && req.body.sodiem && req.body.ngoaingu && req.body.idnn) {

            let userId = req.user.data.idTimViec365
            let chungChi = req.body.chungchi
            let point = req.body.sodiem
            let ngoaiNgu = req.body.ngoaingu
            let id = Number(req.body.idnn)
            let deleteNgoaiNgu = {
                id: id,
                chungChi,
                point,
                ngoaiNgu,
            }
            let updateUser = await Users.findOneAndUpdate({
                $or: [{
                        idTimViec365: userId,
                        type: 0,
                        "inForPerson.candiNgoaiNgu.id": id
                    },
                    {
                        idTimViec365: userId,
                        type: 2,
                        "inForPerson.candiNgoaiNgu.id": id
                    },
                ]
            }, {
                $pull: {
                    "inForPerson.candiNgoaiNgu.$": deleteNgoaiNgu
                },
            })
            if (updateUser) {
                functions.success(res, "Xóa Ngoại ngữ thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi xóa ngoại ngữ", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//Thêm dữ liệu Kinh nghiệm làm việc
exports.addExp = async(req, res, next) => {
    try {
        if (req.user && req.body.chucdanh && req.body.congty && req.body.motaexp && req.body.onetime && req.body.twotime) {

            let userId = req.user.data.idTimViec365
            let jobTitle = req.body.chucdanh
            let company = req.body.congty
            let desExp = req.body.motaexp
            let start = req.body.onetime
            let end = req.body.twotime

            const maxID = await Users.findOne({ idTimViec365: userId }, { "inForPerson.candiExp.id": 1 }).sort({ "inForPerson.candiExp.id": -1 }).limit(1).lean();
            if (maxID.inForPerson.candiExp[0]) {
                newID = Number(maxID.inForPerson.candiExp[maxID.inForPerson.candiExp.length - 1].id + 1);
            } else newID = 1
            let addExp = {
                id: newID,
                jobTitle,
                company,
                desExp,
                start,
                end
            }

            let updateUser = await functions.findOneAndUpdateUser(userId, {
                $push: {
                    "inForPerson.candiExp": addExp
                }
            })
            if (updateUser) {
                functions.success(res, "Thêm kinh nghiệm làm việc thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi thêm kinh nghiệm làm việc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật Kinh nghiệm làm việc
exports.updateExp = async(req, res, next) => {
    try {
        if (req.user && req.body.chucdanh && req.body.congty && req.body.motaexp && req.body.onetime && req.body.twotime && req.body.idkn) {

            let userId = req.user.data._id
            let jobTitle = req.body.chucdanh
            let company = req.body.congty
            let desExp = req.body.motaexp
            let start = req.body.onetime
            let end = req.body.twotime
            let id = req.body.idkn
            let updateExp = {
                id,
                jobTitle,
                company,
                desExp,
                start,
                end
            }

            let updateUser = await Users.findOneAndUpdate({
                $or: [{
                        idTimViec365: userId,
                        type: 0,
                        "inForPerson.candiExp.id": id
                    },
                    {
                        idTimViec365: userId,
                        type: 2,
                        "inForPerson.candiExp.id": id
                    },
                ]
            }, {
                $set: {
                    "inForPerson.candiExp.$": updateExp
                },
            })
            if (updateUser) {
                functions.success(res, "Cập nhật kinh nghiệm làm việc thành công");
            } else {
                return functions.setError(res, "Lỗi", 400);
            }
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
        if (req.user && req.body.chucdanh && req.body.congty && req.body.motaexp && req.body.onetime && req.body.twotime && req.body.idkn) {

            let userId = req.user.data.idTimViec365
            let jobTitle = req.body.chucdanh
            let company = req.body.congty
            let desExp = req.body.motaexp
            let start = req.body.onetime
            let end = req.body.twotime
            let id = req.body.idkn
            let deleteExp = {
                id,
                jobTitle,
                company,
                desExp,
                start,
                end
            }
            let updateUser = await Users.findOneAndUpdate({
                $or: [{
                        idTimViec365: userId,
                        type: 0,
                        "inForPerson.candiExp.id": id
                    },
                    {
                        idTimViec365: userId,
                        type: 2,
                        "inForPerson.candiExp.id": id
                    },
                ]
            }, {
                $pull: {
                    "inForPerson.candiExp.$": deleteExp
                },
            })
            if (updateUser) {
                functions.success(res, "Xóa kinh nghiệm làm việc thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi xóa kinh nghiệm làm việc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//hiển thị danh sách ứng viên theo tỉnh thành, vị trí
exports.list = async(req, res, next) => {
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
                // for (let i = 0; i < findUv.length; i++) {
                //     let listCateId = findUv[i].inForPerson.candiCateID.split(',')
                //     if (listCateId.includes(cate)) {
                //         listUv.push(findUv[i])
                //     }
                // }
                // const totalCount = listUv.length
                // const totalPages = Math.ceil(totalCount / pageSize)
                // if (findUv) {
                //     functions.success(res, "Hiển thị ứng viên theo vị trí, ngành nghề thành công", { totalCount, totalPages, listUv: listUv });
                // }
            let cateId = 1
            let findUser = await Users.find({ "inForPerson.candiCateID": { "$regex": "\\b" + cateId + "\\b", "$not": { "$regex": "\\b" + cateId + "1\\b" } } })
            if (findUv) {
                functions.success(res, "Hiển thị ứng viên theo vị trí, ngành nghề thành công", { listUv: findUser });
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
            console.log(findUv)
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
        let list = []
        let uvAI = await functions.getDataAxios("http://43.239.223.10:4001/recommendation_ungvien", {
            site: "uvtimviec365",
            use_id: req.body.use_id,
            pagination: 1,
            size: 20,
        })
        if (uvAI && uvAI.length > 0) {
            for (let i = 0; i < uvAI.data.item.length; i++) {

                let findUvAI = await Users.findOne({ idTimViec365: uvAI.data.item[i].use_id }, {
                    _id: 1,
                    userName: 1,
                    avatarUser: 1,
                    lastActivedAt: 1,
                    "inForPerson.candiTitle": 1,
                    "inForPerson.candiCityID": 1,
                    "inForPerson.candiMoney": 1
                })
                if (findUvAI) {
                    findUvAI.avatarUser = await functions.getUrlLogoCompany(findUvAI.createdAt, findUvAI.avatarUser)
                    list.push(findUvAI)
                }
                if (list.length == 12) {
                    break
                }
            }
            functions.success(res, "Hiển thị ứng viên ngẫu nhiên theo ai thành công", { list });
        } else return functions.setError(res, "Không có ứng viên phù hợp", 400);

    } catch (e) {
        console.log("Đã có lỗi xảy ra khi hiển thị ứng viên ngẫu nhiên theo ai", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//hiển thị thông tin chi tiết ứng viên theo 3 cách đăng kí
exports.infoCandidate = async(req, res, next) => {
    try {
        if (req.body.iduser) {
            let userId = req.body.iduser
            let CvUv = functions.getDatafindOne(CVUV, { userId: userId })
            let userInfo = await functions.findOneUser(userId)

            if (userInfo) {
                let candidateAI = await functions.getDataAxios('http://localhost:3000/api/timviec/candidate/candidateAI', { use_id: userId })
                if (req.user && req.user.data.type == 1) {
                    let companyId = req.user.data.idTimViec365
                    let checkApplyForJob = await functions.getDatafindOne(applyForJob, { userID: userId, comID: companyId })
                    let checkPoint = await functions.getDatafindOne(pointUsed, { uscID: companyId, useID: userId })

                    if (checkApplyForJob && checkPoint) {
                        functions.success(res, "Hiển thị chi tiết ứng viên thành công", { userInfo, CvUv, checkStatus: true, candidateAI: candidateAI });
                    } else {
                        userInfo.phoneTK = "bạn chưa sử dụng điểm để xem sdt đăng kí"
                        userInfo.phone = "bạn chưa sử dụng điểm để xem sdt"
                        userInfo.email = "bạn chưa sử dụng điểm để xem email"
                        userInfo.emailContact = "bạn chưa sử dụng điểm để xem email liên hệ"
                        functions.success(res, "Hiển thị chi tiết ứng viên thành công", { userInfo, CvUv, checkStatus: false, candidateAI: candidateAI });

                    }
                } else if (req.user && req.user.data.idTimViec365 == userId) {
                    functions.success(res, "Hiển thị chi tiết ứng viên thành công", { userInfo, CvUv, checkStatus: true, candidateAI: candidateAI });
                } else {
                    userInfo.phoneTK = "đăng nhập để xem sdt đăng kí"
                    userInfo.phone = "đăng nhập để xem sdt"
                    userInfo.email = "đăng nhập để xem email"
                    userInfo.emailContact = "đăng nhập để xem email liên hệ"
                    functions.success(res, "Hiển thị chi tiết ứng viên thành công", { userInfo, CvUv, checkStatus: false, candidateAI: candidateAI });
                }
            } else return functions.setError(res, "Không có thông tin user", 400);


        } else return functions.setError(res, "thông tin truyền lên không đầy đủ", 400);

    } catch (e) {
        console.log("Đã có lỗi xảy ra khi xóa kinh nghiệm làm việc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//ứng viên ứng tuyển 
exports.candidateApply = async(req, res, next) => {
    try {
        if (req.user && req.body.idtin) {
            let newId = req.body.idtin,
                userId = req.user.data.idTimViec365,
                cv = req.user.data.inForPerson.cv,
                link = req.body.link;

            const maxID = await applyForJob.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();

            let checkApplyForJob = await functions.getDatafindOne(applyForJob, { userID: userId, newID: newId })
            let checkNew = await functions.getDatafindOne(newTV365, { _id: newId })
            if (checkApplyForJob) {
                return functions.setError(res, "Ứng viên đã nộp hồ sơ", 400);
            } else if (!checkNew) {
                return functions.setError(res, "Không tồn tại tin đăng này", 400);
            } else {
                let newIDMax;
                if (maxID) {
                    newIDMax = Number(maxID._id) + 1;
                } else newIDMax = 1
                let newApplyForJob = new applyForJob({
                    _id: newIDMax,
                    userID: userId,
                    comID: checkNew.userID,
                    newID: newId,
                    time: new Date(Date.now()),
                    cv: cv
                })
                console.log(checkNew);
                newApplyForJob.save()
                if (newApplyForJob) {
                    functions.success(res, "ứng viên ứng tuyển thành công")
                    functions.getDataAxios("http://43.239.223.142:9000/api/V2/Notification/NotificationTimviec365", {
                        EmployeeId: req.user.data._id,
                        CompanyId: checkNew.userID,
                        Type: 2,
                        Link: link,
                        Position: checkNew.title,
                        City: checkNew.cityID,
                        Career: cate.name,
                    })
                }
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi ứng tuyển", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//ứng viên lưu tin
exports.candidateSavePost = async(req, res, next) => {
    try {
        if (req.user && req.body.idtin) {
            let newId = req.body.idtin
            let userId = req.user.data.idTimViec365

            let checkNew = await functions.getDatafindOne(newTV365, { _id: newId })
                //check xem có tin hay ko
            if (checkNew) {
                let checkUserSavePost = await functions.getDatafindOne(userSavePost, { userID: userId, newID: newId })
                    //check ứng viên đã lưu tin hay ko
                if (checkUserSavePost) {
                    let deleteSavePost = await userSavePost.deleteOne({ userID: userId, newID: newId })
                    if (deleteSavePost) {
                        functions.success(res, "ứng viên bỏ lưu tin ứng tuyển thành công")
                    }
                } else {
                    let newIDMax
                    const maxID = await userSavePost.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                    if (maxID) {
                        newIDMax = Number(maxID._id) + 1;
                    } else newIDMax = 1
                    let newUserSavePost = new userSavePost({
                        _id: newIDMax,
                        userID: userId,
                        newID: newId,
                        saveTime: new Date(Date.now()),
                    })
                    newUserSavePost.save()
                    if (newUserSavePost) {
                        functions.success(res, "ứng viên lưu tin ứng tuyển thành công")
                    }
                }
            }

        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi ứng viên lưu tin ứng tuyển", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//comment tin ứng tuyển
exports.commentPost = async(req, res, next) => {
    try {
        if (req.user && req.body.idPost && req.body.cm_id && req.body.name && req.body.comment) {
            let userId = req.user.data.idTimViec365
            let idPost = req.body.idPost
            let parentCmId = req.body.cm_id
            let imageComment = req.file
            let CommentName = req.body.name
            let comment = req.body.comment
            let hasTag = req.body.cm_hastag
            let author = req.body.author

            let timeCheck = new Date(Date.now() - 30000)
            let findComment = await functions.getDatafind(CommentPost, { idPost: idPost, commentPersonId: userId, timeComment: { $gt: timeCheck } })
            let findNew = await newTV365.findOne({ _id: idPost }, { userID: 1 })
            if (findNew) {
                if (findComment && findComment.length < 10) {
                    const maxID = await CommentPost.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                    if (maxID) {
                        newID = Number(maxID._id) + 1;
                    } else newID = 1

                    if (req.file) {
                        let addNewComment = new CommentPost({
                            _id: newID,
                            idPost: idPost,
                            parentCmId: parentCmId,
                            commentPersonId: userId,
                            comment: comment,
                            commentName: CommentName,
                            commentAvatar: req.user.data.avatarUser,
                            image: imageComment.filename,
                            timeComment: new Date(Date.now()),
                            tag: hasTag,
                            author: author
                        })
                        addNewComment.save()
                        if (addNewComment) {
                            functions.success(res, "Thêm bình luận thành công");
                            axios({
                                method: "post",
                                url: "http://43.239.223.142:9000/api/V2/Notification/SendNotification",
                                data: {
                                    'Title': 'Thông báo bình luận',
                                    'Message': `bài viết bạn đã được bình luận bởi ${CommentName}`,
                                    'Type': 'SendCandidate',
                                    'UserId': `${findNew.userID}`,
                                    'SenderId': `${req.user.data._id}`,
                                    // 'Link': link,
                                },
                                headers: { "Content-Type": "multipart/form-data" }
                            })
                        }
                    } else {
                        let addNewComment = new CommentPost({
                            _id: newID,
                            idPost: idPost,
                            parentCmId: parentCmId,
                            commentPersonId: userId,
                            comment: comment,
                            commentName: CommentName,
                            commentAvatar: req.user.data.avatarUser,
                            timeComment: new Date(Date.now()),
                            tag: hasTag,
                            author: author
                        })
                        addNewComment.save()
                        if (addNewComment) {
                            functions.success(res, "Thêm bình luận thành công");
                            axios({
                                method: "post",
                                url: "http://43.239.223.142:9000/api/V2/Notification/SendNotification",
                                data: {
                                    'Title': 'Thông báo bình luận',
                                    'Message': `bài viết bạn đã được bình luận bởi ${CommentName}`,
                                    'Type': 'SendCandidate',
                                    'UserId': `${findNew.userID}`,
                                    'SenderId': `${req.user.data._id}`,
                                    // 'Link': link,
                                },
                                headers: { "Content-Type": "multipart/form-data" }
                            })
                        }
                    }
                } else return functions.setError(res, "bạn đã bình luận quá nhanh", 400);
            } else return functions.setError(res, "không tồn tại tin tuyển dụng này", 400);

        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi thêm kinh nghiệm làm việc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//Xóa việc làm ừng tuyển
exports.deleteJobCandidateApply = async(req, res, next) => {
    try {
        if (req.user && req.body.new_id) {

            let userId = req.user.data.idTimViec365
            let newId = req.body.new_id
            let deleteJobUv = await functions.getDataDeleteOne(applyForJob, { _id: newId, userID: userId })

            if (deleteJobUv) {
                functions.success(res, "Xóa thông tin thành công");
            } else return functions.setError(res, "Xóa không thành công", 400);
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//hiển thị danh sách ứng viên theo tỉnh thành, vị trí
exports.list = async(req, res, next) => {
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
                // for (let i = 0; i < findUv.length; i++) {
                //     let listCateId = findUv[i].inForPerson.candiCateID.split(',')
                //     if (listCateId.includes(cate)) {
                //         listUv.push(findUv[i])
                //     }
                // }
                // const totalCount = listUv.length
                // const totalPages = Math.ceil(totalCount / pageSize)
                // if (findUv) {
                //     functions.success(res, "Hiển thị ứng viên theo vị trí, ngành nghề thành công", { totalCount, totalPages, listUv: listUv });
                // }
            let cateId = 1
            let findUser = await Users.find({ "inForPerson.candiCateID": { "$regex": "\\b" + cateId + "\\b", "$not": { "$regex": "\\b" + cateId + "1\\b" } } })
            if (findUv) {
                functions.success(res, "Hiển thị ứng viên theo vị trí, ngành nghề thành công", { listUv: findUser });
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
            console.log(findUv)
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

exports.test = async(req, res, next) => {
    try {
        await sendMail.Send_NTD_xem_UV("nguyentronghungyt123@gmail.com", "Hung", "HungHaPay", "1", "2", "IT")
            // await sendMail.SendmailHunghapay("TV365", "nguyentronghungyt123@gmail", "Timviec365", "CiAgICA8Ym9keSBzdHlsZT0id2lkdGg6IDEwMCU7YmFja2dyb3VuZC1jb2xvcjogI2RhZDdkNzt0ZXh0LWFsaWduOiBqdXN0aWZ5O3BhZGRpbmc6IDA7bWFyZ2luOiAwO2ZvbnQtZmFtaWx5OiBhcmlhbDtwYWRkaW5nLXRvcDogMjBweDtwYWRkaW5nLWJvdHRvbTogMjBweDsiPgogICAgICAgIDx0YWJsZSBzdHlsZT0id2lkdGg6IDcwMHB4O2JhY2tncm91bmQ6I2ZmZjsgbWFyZ2luOjAgYXV0bztib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO2NvbG9yOiAjMDAwIj4KICAgICAgICAgICAgPHRyIHN0eWxlPSJoZWlnaHQ6IDEyMHB4O2JhY2tncm91bmQtaW1hZ2U6IHVybChodHRwczovL3RpbXZpZWMzNjUudm4vaW1hZ2VzL2VtYWlsL2Jhbm5lcl9tYWlseGVtVVYucG5nKTtiYWNrZ3JvdW5kLXNpemU6MTAwJSAxMDAlO2JhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7ZmxvYXQ6IGxlZnQ7d2lkdGg6IDEwMCU7cGFkZGluZzogMHB4IDMwcHg7Ym94LXNpemluZzogYm9yZGVyLWJveDsiPgogICAgICAgICAgICA8L3RyPgogICAgICAgICAgICA8dHI+PHRkIHN0eWxlPSJwYWRkaW5nLWJvdHRvbTogMjBweDtiYWNrZ3JvdW5kOiAjZGFkN2Q3Ij48L3RkPjwvdHI+CiAgICAgICAgICAgIDx0ciAgc3R5bGU9ImZsb2F0OiBsZWZ0O3BhZGRpbmc6MTBweCAxNXB4IDBweCAxNXB4O21pbi1oZWlnaHQ6IDE3NXB4OyI+CiAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj0iMiI+CiAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9ImZvbnQtc2l6ZTogMTZweDttYXJnaW46IDA7bGluZS1oZWlnaHQ6IDE5cHg7bWFyZ2luLWJvdHRvbTogNXB4O3BhZGRpbmctdG9wOiAxNXB4OyI+WGluIGNow6BvIEh1bmc8L3A+CiAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9ImZvbnQtc2l6ZTogMTZweDttYXJnaW46IDA7bGluZS1oZWlnaHQ6IDE5cHg7bWFyZ2luLWJvdHRvbTogNXB4O3BhZGRpbmctdG9wOiA1cHg7Ij5Dw6FtIMahbiBi4bqhbiDEkcOjIHRpbiB0xrDhu59uZyBUaW12aWVjMzY1LnZuIGzDoCBj4bqndSBu4buRaSBnacO6cCBi4bqhbiB0w6xtIGtp4bq/bSBjw7RuZyB2aeG7h2MgbW9uZyBtdeG7kW4uPC9wPgogICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPSJmb250LXNpemU6IDE2cHg7bWFyZ2luOiAwO2xpbmUtaGVpZ2h0OiAxOXB4O21hcmdpbi1ib3R0b206IDVweDtwYWRkaW5nLXRvcDogNXB4OyI+PHNwYW4+PGEgc3R5bGU9IiAgICBmb250LXdlaWdodDogYm9sZDtjb2xvcjogIzMwN2RmMTt0ZXh0LWRlY29yYXRpb246IG5vbmU7IiBocmVmPSIxIj5I4buTIHPGoSBj4bunYSBi4bqhbjwvYT4gdHLDqm4gd2Vic2l0ZSBUaW12aWVjMzY1LnZuIMSRw6MgxJHGsOG7o2MgbmjDoCB0dXnhu4NuIGThu6VuZyA8c3Bhbj48YSBzdHlsZT0iZm9udC13ZWlnaHQ6IGJvbGQ7Y29sb3I6ICMzMDdkZjE7dGV4dC1kZWNvcmF0aW9uOiBub25lOyIgaHJlZj0iMiI+SHVuZ0hhUGF5PC9hPiB4ZW08L3NwYW4+LiBC4bqhbiBjw7MgdGjhu4MgdGhhbSBraOG6o28gY8OhYyBjw7RuZyB2aeG7h2MgdMawxqFuZyB04buxIHhlbSBjw7MgcGjDuSBo4bujcCB24bubaSBtw6xuaCBraMO0bmcgbmjDqSE8L3A+IAogICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPSJmb250LXNpemU6IDE2cHg7bWFyZ2luOiAwO2xpbmUtaGVpZ2h0OiAxOXB4O21hcmdpbi1ib3R0b206IDVweDtwYWRkaW5nLXRvcDogNXB4OyI+VHLDom4gdHLhu41uZyE8L3A+CiAgICAgICAgICAgICAgICA8L3RkPgogICAgICAgICAgICA8L3RyPiAKICAgICAgICAgICAgPHRyPjx0ZCBzdHlsZT0icGFkZGluZy1ib3R0b206IDIwcHg7YmFja2dyb3VuZDogI2RhZDdkNyI+PC90ZD48L3RyPgogICAgICAgICAgICA8dHIgc3R5bGU9ImZsb2F0OmxlZnQ7cGFkZGluZzoxMHB4IDE1cHggMHB4IDE1cHg7d2lkdGg6MTAwJTtib3gtc2l6aW5nOiBib3JkZXItYm94OyI+CiAgICAgICAgICAgICAgICA8dGQgc3R5bGU9ImRpc3BsYXk6YmxvY2s7Ij4KICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT0iZm9udC1zaXplOiAxNnB4O21hcmdpbjogMDtsaW5lLWhlaWdodDogMjVweDttYXJnaW4tYm90dG9tOiA1cHg7Ij4KICAgICAgICAgICAgICAgICAgICAgICAgVGltdmllYzM2NS52biBn4butaSBi4bqhbiBkYW5oIHPDoWNoIHZp4buHYyBsw6BtIHTGsMahbmcgdOG7sSAKICAgICAgICAgICAgICAgICAgICA8L3A+CiAgICAgICAgICAgICAgICA8L3RkPgogICAgICAgICAgICA8L3RyPgogICAgICAgICAgICBJVAogICAgICAgICAgICA8dHI+PHRkIHN0eWxlPSJwYWRkaW5nLWJvdHRvbTogMjBweDtiYWNrZ3JvdW5kOiAjZGFkN2Q3Ij48L3RkPjwvdHI+CiAgICAgICAgICAgIDx0ciAgc3R5bGU9ImZsb2F0OiBsZWZ0O3BhZGRpbmc6MHB4IDE1cHggMHB4IDE1cHg7bWluLWhlaWdodDogMTE1cHg7Ij4KICAgICAgICAgICAgICAgIDx0ZD4KICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT0ibWFyZ2luOiAwO2ZvbnQtc2l6ZTogMTRweDttYXJnaW46IDA7bGluZS1oZWlnaHQ6IDE5cHg7bWFyZ2luLWJvdHRvbTogNXB4O3BhZGRpbmctdG9wOiAxNXB4O2NvbG9yOiAjMzA3ZGYxIj5Dw7RuZyB0eSBD4buVIHBo4bqnbiBUaGFuaCB0b8OhbiBIxrBuZyBIw6A8L3A+CiAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9Im1hcmdpbjogMDtmb250LXNpemU6IDE0cHg7bWFyZ2luOiAwO2xpbmUtaGVpZ2h0OiAxOXB4O2NvbG9yOiM0RDRENEQiPjxzcGFuIHN0eWxlPSJjb2xvcjogIzMwN2RmMSI+VlAxOiA8L3NwYW4+VOG6p25nIDQsIEI1MCwgTMO0IDYsIEvEkFQgxJDhu4tuaCBDw7RuZyAtIEhvw6BuZyBNYWkgLSBIw6AgTuG7mWk8L3A+CiAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9Im1hcmdpbjogMDtmb250LXNpemU6IDE0cHg7bWFyZ2luOiAwO2xpbmUtaGVpZ2h0OiAxOXB4O21hcmdpbi1ib3R0b206IDVweDtjb2xvcjojNEQ0RDREIj48c3BhbiBzdHlsZT0iY29sb3I6ICMzMDdkZjEiPlZQMjogPC9zcGFuPiBUaMO0biBUaGFuaCBNaeG6v3UsIFjDoyBWaeG7h3QgSMawbmcsIEh1eeG7h24gVsSDbiBMw6JtLCBU4buJbmggSMawbmcgWcOqbjwvcD4KICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT0ibWFyZ2luOiAwO2ZvbnQtc2l6ZTogMTRweDttYXJnaW46IDA7bGluZS1oZWlnaHQ6IDE5cHg7bWFyZ2luLWJvdHRvbTogNXB4O2NvbG9yOiM0RDRENEQiPjxzcGFuIHN0eWxlPSJjb2xvcjogIzMwN2RmMSI+SG90bGluZTo8L3NwYW4+IDE5MDA2MzM2ODIgLSDhuqVuIHBow61tIDE8L3A+CiAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9Im1hcmdpbjogMDtmb250LXNpemU6IDE0cHg7bWFyZ2luOiAwO2xpbmUtaGVpZ2h0OiAxOXB4O21hcmdpbi1ib3R0b206IDVweDtwYWRkaW5nLWJvdHRvbTogMTVweDtjb2xvcjojNEQ0RDREIj48c3BhbiBzdHlsZT0iY29sb3I6ICMzMDdkZjEiPkVtYWlsIGjhu5cgdHLhu6M6PC9zcGFuPiB0aW12aWVjMzY1LnZuQGdtYWlsLmNvbTwvcD4KICAgICAgICAgICAgICAgIDwvdGQ+CiAgICAgICAgICAgIDwvdHI+CiAgICAgICAgICAgIDx0cj48dGQgc3R5bGU9InBhZGRpbmctYm90dG9tOiAzOXB4O2JhY2tncm91bmQ6ICNkYWQ3ZDciPjwvdGQ+PC90cj4KICAgICAgICA8L3RhYmxlPgogICAgPC9ib2R5Pgo=", 16)
        functions.success(res, "thành công");
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}