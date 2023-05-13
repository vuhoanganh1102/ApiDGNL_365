const Users = require('../../models/Users');
const blog = require('../../models/Timviec365/Timviec/blog.model');
const hoso = require('../../models/Timviec365/Timviec/hoso');
const CVUV = require('../../models/Timviec365/CV/CVUV');
const donUV = require('../../models/Timviec365/CV/donUV');
const HoSoUV = require('../../models/Timviec365/CV/HoSoUV');
const ThuUV = require('../../models/Timviec365/CV/ThuUV');
const CV = require('../../models/Timviec365/CV/CV');
const like = require('../../models/Timviec365/CV/like');
const userUnset = require('../../models/Timviec365/Timviec/userUnset');
const newTV365 = require('../../models/Timviec365/Timviec/newTV365.model');
const nopHoSo = require('../../models/Timviec365/Timviec/nopHoSo');
const luuViecLam = require('../../models/Timviec365/Timviec/luuViecLam');
//mã hóa mật khẩu
const md5 = require('md5');
//token
var jwt = require('jsonwebtoken');
const axios = require('axios');
const functions = require('../../services/functions');
const { token } = require('morgan');
const fs = require('fs');
const path = require('path');


exports.index = (req, res, next) => {
    res.json('123 123123123')
}

//đăng kí ứng viên B1
exports.RegisterB1 = async(req, res, next) => {
    try {
        if (req.body.phoneTK) {
            const phoneTK = req.body.phoneTK
            const password = md5(req.body.password)
            const userName = req.body.userName
            const email = req.body.email
            const city = req.body.city
            const district = req.body.district
            const address = req.body.address
            const candiCateID = req.body.candiCateID
            const candiCityID = req.body.candiCityID
            const candiTitle = req.body.candiTitle
            const uRegis = req.body.uRegis

            // check số điện thoại đã đăng kí trong bảng user
            let CheckEmail = await functions.checkEmail(email)
            let CheckPhoneNumber = await functions.checkPhoneNumber(phoneTK);

            if (CheckPhoneNumber) { //check định dạng sdt
                let checkUser = await functions.getDatafindOne(Users, { phoneTK })

                if (checkUser) { // check trùng số điện thoại trong user
                    return functions.setError(res, "Số điện thoại đã được đăng kí", 200);
                } else {
                    if (!email || CheckEmail) { // check định dạng email
                        // const newID
                        const maxID = await userUnset.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                        if (maxID) {
                            newID = Number(maxID._id) + 1;
                        } else newID = 1
                        const maxIDUser = await Users.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                        if (maxIDUser) {
                            newIDUser = Number(maxIDUser._id) + 1;
                        }
                        let findUserUv = await functions.getDatafindOne(userUnset, { usePhoneTk: phoneTK })
                        if (findUserUv) {
                            let updateUserUv = await functions.getDatafindOneAndUpdate(userUnset, { usePhoneTk: phoneTK }, {
                                usePass: password,
                                useFirstName: userName,
                                useMail: email,
                                useCity: city,
                                useQh: district,
                                useAddr: address,
                                uRegis: uRegis,
                                useCvCate: candiCateID,
                                useCvCity: candiCityID,
                                useCvTitle: candiTitle
                            })

                        } else {
                            let UserUV = new userUnset({
                                _id: newID,
                                usePhoneTk: phoneTK,
                                usePass: password,
                                useFirstName: userName,
                                useMail: email,
                                useCity: city,
                                useQh: district,
                                useAddr: address,
                                uRegis: uRegis,
                                useCvCate: candiCateID,
                                useCvCity: candiCityID,
                                useCvTitle: candiTitle,
                                usePhone: "",
                                useCreateTime: new Date(Date.now()),
                                useLink: "",
                                useActive: 0,
                                useDelete: 0,
                                type: 0,


                            })
                            let saveUserUV = UserUV.save()
                        }
                        req.body.password = md5(req.body.password)
                        req.body._id = maxIDUser._id
                        const token = await functions.createToken(req.body, "2d")

                        return functions.success(res, 'Them moi hoặc cập nhật UV chua hoan thanh ho so thanh cong', token)
                    } else return functions.setError(res, "Email không hợp lệ", 200);
                }
            } else return functions.setError(res, "Số điện thoại không hợp lệ", 200);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi đăng kí B1", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }

}

//đăng kí ứng viên B2 bằng video
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

            let findUser = await functions.getDatafindOne(Users, { phoneTK: phoneTK })
            if (findUser && findUser.phoneTK && findUser.phoneTK == phoneTK) { // check tồn tại tài khoản chưa
                return functions.setError(res, "Số điện thoại này đã được đăng kí", 200);
            } else {
                const maxID = await Users.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                if (maxID) {
                    newID = Number(maxID._id) + 1;
                }
                const maxIDTimviec = await Users.findOne({ type: 0 }, { idTimViec365: 1 }).sort({ idTimViec365: -1 }).lean();
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
                        email: email,
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
                        email: email,
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
                let deleteUser = userUnset.findOneAndDelete({ usePhoneTk: phoneTK })
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
            const birthday = req.body.birthday
            const candiExp = req.body.candiExp
            const candiHocVan = req.body.candiHocVan
            const candiSchool = req.body.candiSchool
            const fileUpload = req.files
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
            let cvUpload, videoUpload

            if (!fileUpload.cvUpload) {
                return functions.setError(req, "không tải Cv", 200)
            }
            if (fileUpload.cvUpload) {
                cvUpload = fileUpload.cvUpload
            }
            if (fileUpload.videoUpload) {
                videoUpload = fileUpload.videoUpload
                if (videoUpload.size > (100 * 1024 * 1024)) {
                    return functions.setError(req, "dung lượng file vượt quá 100 MB", 200)
                }
            }
            let findUser = await functions.getDatafindOne(Users, { phoneTK: phoneTK })
            if (findUser && findUser.phoneTK && findUser.phoneTK == phoneTK) { // check tồn tại tài khoản chưa
                return functions.setError(res, "Số điện thoại này đã được đăng kí", 200);
            } else {
                const maxID = await Users.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                if (maxID) {
                    newID = Number(maxID._id) + 1;
                }
                const maxIDTimviec = await Users.findOne({ type: 0 }, { idTimViec365: 1 }).sort({ idTimViec365: -1 }).lean();
                if (maxIDTimviec) {
                    newIDTimviec = Number(maxIDTimviec.idTimViec365) + 1;
                }
                if (videoUpload && !videoLink) { // check video tải lên là file video
                    console.log(1)
                    let User = new Users({
                        _id: newID,
                        phoneTK: phoneTK,
                        password: password,
                        userName: userName,
                        type: 0,
                        email: email,
                        city: city,
                        district: district,
                        address: address,
                        from: from,
                        idTimViec365: newIDTimviec,
                        authentic: 0,
                        createdAt: new Date(Date.now()),
                        birthday: birthday,
                        inForPerson: {
                            user_id: 0,
                            candiCateID: candiCateID,
                            candiCityID: candiCityID,
                            candiTitle: candiTitle,
                            candiExp: candiExp,
                            candiHocVan: candiHocVan,
                            candiSchool: candiSchool,
                            video: videoUpload[0].filename,
                            cv: cvUpload[0].filename,
                            videoType: 1,
                            videoActive: 1
                        }
                    });
                    User.save();
                }
                if (videoLink && !videoUpload) { //check video upload là link

                    let User = new Users({
                        _id: newID,
                        phoneTK: phoneTK,
                        password: password,
                        userName: userName,
                        type: 0,
                        email: email,
                        city: city,
                        district: district,
                        address: address,
                        from: from,
                        idTimViec365: newIDTimviec,
                        authentic: 0,
                        createdAt: new Date(Date.now()),
                        birthday: birthday,
                        inForPerson: {
                            user_id: 0,
                            candiCateID: candiCateID,
                            candiCityID: candiCityID,
                            candiTitle: candiTitle,
                            candiExp: candiExp,
                            candiHocVan: candiHocVan,
                            candiSchool: candiSchool,
                            video: videoLink,
                            cv: cvUpload[0].filename,
                            videoType: 2,
                            videoActive: 1
                        }
                    })
                    let saveUser = User.save()
                }
                let deleteUser = userUnset.findOneAndDelete({ usePhoneTk: phoneTK })
                return functions.success(res, "Đăng kí thành công")
            }
        } else return functions.setError(res, "Thông tin truyền lên không đầy đủ", 200);
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi đăng kí", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 200)
    }


}

//thêm dữ liệu chat365
exports.AddUserChat365 = async(req, res, next) => {
    try {
        // for(let i=0;i<325900;i=i+100){
        let takeData = await axios({
            method: "post",
            url: "http://43.239.223.142:9006/api/users/TakeDataUser",
            data: {
                count: 0
            },
            headers: { "Content-Type": "multipart/form-data" }
        });
        for (let j = 0; j < takeData.data.data.length; j++) {
            let CheckEmail = await functions.CheckEmail(takeData.data.data.email)
            let CheckPhoneNumber = await functions.CheckPhoneNumber(takeData.data.data.email)
            let checkUser = await functions.getDatafindOne(Users, { phoneTK: takeData.data.data.email, type: takeData.data.data.email })
            if (!checkUser && CheckPhoneNumber) {
                let user = new Users({
                    _id: takeData.data.data._id,
                    idQLC: takeData.data.data.id365,
                    type: takeData.data.data.type365,
                    phoneTK: takeData.data.data.email,
                    password: takeData.data.data.password,
                    userName: takeData.data.data.userName,
                    avatarUser: takeData.data.data.avatarUser,
                    lastActivedAt: takeData.data.data.lastActive,
                    isOnline: takeData.data.data.isOnline,
                    idTimViec365: takeData.data.data.idTimviec,
                    from: takeData.data.data.fromWeb,
                    chat365_secret: takeData.data.data.secretCode,
                    latitude: takeData.data.data.latitude,
                    longitude: takeData.data.data.longitude,
                })
            }
            if (!checkUser && CheckEmail) {
                let user = new Users({
                    _id: takeData.data.data._id,
                    idQLC: takeData.data.data.id365,
                    type: takeData.data.data.type365,
                    email: takeData.data.data.email,
                    password: takeData.data.data.password,
                    userName: takeData.data.data.userName,
                    avatarUser: takeData.data.data.avatarUser,
                    lastActivedAt: takeData.data.data.lastActive,
                    isOnline: takeData.data.data.isOnline,
                    idTimViec365: takeData.data.data.idTimviec,
                    from: takeData.data.data.fromWeb,
                    chat365_secret: takeData.data.data.secretCode,
                    latitude: takeData.data.data.latitude,
                    longitude: takeData.data.data.longitude,
                })
            }
        }
        // }
        res.json(await functions.success("Add dữ liệu thành công"))

    } catch (e) {
        console.log("add sữu liệu lỗi", e);
        functions.setError(res, 'Add sữu liệu lỗi', 404)
    }

}

//đăng kí ứng viên bước 2 bằng cách tạo cv trên site
exports.RegisterB2CvSite = async(req, res, next) => {
    try {
        if (req && req.body && req.file) {
            const imageUpload = req.file
            const lang = req.body.lang
            const html = JSON.stringify(req.body.html)
            const cvId = req.body.cvId
            const status = req.body.status
            const heightCv = req.body.heightCv
            const scan = req.body.scan
            const state = req.body.state
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


            let findUser = await functions.getDatafindOne(Users, { phoneTK: phoneTK })
            if (findUser && findUser.phoneTK && findUser.phoneTK == phoneTK) { // check tồn tại tài khoản chưa
                return functions.setError(res, "Số điện thoại này đã được đăng kí", 200);
            } else {
                const maxID = await Users.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                if (maxID) {
                    newID = Number(maxID._id) + 1;
                }
                const maxIDTimviec = await Users.findOne({ type: 0 }, { idTimViec365: 1 }).sort({ idTimViec365: -1 }).lean();
                if (maxIDTimviec) {
                    newIDTimviec = Number(maxIDTimviec.idTimViec365) + 1;
                }
                const maxIDCv = await CVUV.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
                if (maxIDCv) {
                    newIDCv = Number(maxIDCv._id) + 1
                } else {
                    newIDCv = 0
                }
                let User = new Users({
                    _id: newID,
                    phoneTK: phoneTK,
                    password: password,
                    userName: userName,
                    type: 0,
                    email: email,
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
                    }
                })
                User.save()
                let CvUv = new CVUV({
                    _id: newIDCv,
                    userId: newID,
                    cvId: cvId,
                    lang: lang,
                    html: html,
                    nameImage: imageUpload.filename,
                    timeEdit: new Date(Date.now()),
                    status: status,
                    scan: scan,
                    state: state,
                    heightCv: heightCv,
                })
                CvUv.save()

                let deleteUser = userUnset.findOneAndDelete({ usePhoneTk: phoneTK })
                return functions.success(res, "Đăng kí thành công")
            }
        } else return functions.setError(res, "Thông tin truyền lên không đầy đủ", 200);
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi đăng kí", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 200)
    }


}

//ứng viên đăng nhập
exports.loginUv = async(req, res, next) => {

    if (req.body.phoneTK && req.body.password) {
        const type = 0;
        const phoneTK = req.body.phoneTK
        const password = req.body.password

        let checkPhoneNumber = await functions.checkPhoneNumber(phoneTK);
        if (checkPhoneNumber) {
            let findUser = await functions.getDatafindOne(Users, { phoneTK })
            if (!findUser) {
                return functions.setError(res, "không tìm thấy tài khoản trong bảng user", 200)
            }
            let checkPassword = await functions.verifyPassword(password, findUser.password)
            if (!checkPassword) {
                return functions.setError(res, "Mật khẩu sai", 200)
            }
            if (findUser.type == type) {
                const token = await functions.createToken(findUser, "2d")
                return functions.success(res, 'Đăng nhập thành công', token)
            } else return functions.setError(res, "tài khoản này không phải tài khoản cá nhân", 200)


        } else {
            return functions.setError(res, "không đúng định dạng số điện thoại", 200)
        }
    }
}

// trang qlc trong hoàn thiện hồ sơ
exports.completeProfileQlc = async(req, res, next) => {
    try {
        let phoneTK = String(req.user.data.phoneTK)
        let newAI = []
        let newCv = []
        let newBlog = []
        console.log(req.user.data)
        let candiCateID = Number(req.user.data.inForPerson.candiCateID.split(",")[0])

        let takeData = await axios({
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
        let listNewId = takeData.data.data.list_id.split(",")
        for (let i = 0; i < listNewId.length; i++) {
            listNewId[i] = Number(listNewId[i])
        }

        let findNew = await functions.getDatafind(newTV365, { _id: { $in: listNewId } })
        for (let i = 0; i < findNew.length; i++) {
            newAI.push(findNew[i])
        }

        let findCv = await functions.getDatafind(CV, {})

        for (let i = 0; i < findCv.length; i++) {
            newCv.push(findCv[i])
        }

        let findBlog = await functions.getDatafind(blog, { categoryID: candiCateID })
        for (let i = 0; i < findBlog.length; i++) {
            newBlog.push(findBlog[i])
        }


        functions.success(res, "Hiển thị qlc thành công", { newAI, newCv, newBlog })
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
            let userId = req.user.data._id
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
            let userId = req.user.data._id
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
            let userId = req.user.data._id
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
            let userId = req.user.data._id
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
            let page = Number(req.body.page)
            let pageSize = Number(req.body.pageSize)
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let userId = req.user.data._id
            let listJobUv = await functions.pageFind(nopHoSo, { userId }, { _id: 1 }, skip, limit)
            const totalCount = await nopHoSo.countDocuments({ userId: userId })
            const totalPages = Math.ceil(totalCount / pageSize)
            if (listJobUv) {
                functions.success(res, "Hiển thị những việc làm ứng viên đã ứng tuyển thành công", { listJobCandidateApply: { totalCount, totalPages, listJob: listJobUv } });
            }
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
            let page = Number(req.body.page)
            let pageSize = Number(req.body.pageSize)
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let userId = req.user.data._id
            let listJobUvSave = await functions.pageFind(luuViecLam, { userId }, { _id: 1 }, skip, limit)
            const totalCount = await nopHoSo.countDocuments({ userId: userId })
            const totalPages = Math.ceil(totalCount / pageSize)
            if (listJobUvSave) {
                functions.success(res, "Hiển thị những việc làm ứng viên đã ứng tuyển thành công", { listJobCandidateSave: { totalCount, totalPages, listJob: listJobUvSave } });
            }
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
        if (req.user && req.body.userName && req.body.phone && req.body.address && req.body.birthday &&
            req.body.gender && req.body.married && req.body.city && req.body.district) {

            let userId = req.user.data._id
            let userName = req.body.userName
            let phone = req.body.phone
            let address = req.body.address
            let birthday = req.body.birthday
            let gender = req.body.gender
            let married = req.body.married
            let city = req.body.city
            let district = req.body.district
            let avatarUser = req.file
            let updateUser = await functions.getDatafindOneAndUpdate(Users, { _id: userId }, {
                userName: userName,
                phone: phone,
                address: address,
                city: city,
                district: district,
                avatarUser: avatarUser.filename,
                inForPerson: {
                    birthday: birthday,
                    gender: gender,
                    married: married,
                }
            })
            if (updateUser) {
                functions.success(res, "Cập nhật thông tin liên hệ thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật công việc mong muốn
exports.updateDesiredJob = async(req, res, next) => {
    try {
        if (req.user && req.body.candiTitle && req.body.candiLoaiHinh && req.body.candiCityID && req.body.candiCateID &&
            req.body.candiExp && req.body.candiCapBac && req.body.candiMoney) {

            let userId = req.user.data._id
            let candiTitle = req.body.candiTitle
            let candiLoaiHinh = req.body.candiLoaiHinh
            let candiCityID = req.body.candiCityID
            let candiCateID = req.body.candiCateID
            let candiExp = req.body.candiExp
            let candiCapBac = req.body.candiCapBac
            let candiMoney = req.body.candiMoney
            let updateUser = await functions.getDatafindOneAndUpdate(Users, { _id: userId }, {
                inForPerson: {
                    candiCateID: candiCateID,
                    candiExp: candiExp,
                    candiCapBac: candiCapBac,
                    candiTitle: candiTitle,
                    candiLoaiHinh: candiLoaiHinh,
                    candiCityID: candiCityID,
                    candiMoney: candiMoney,
                }
            })
            if (updateUser) {
                functions.success(res, "Cập nhật thông tin công việc mong muốn thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật mục tiêu nghề nghiệp
exports.updateCareerGoals = async(req, res, next) => {
    try {
        if (req.user && req.body.candiMucTieu) {

            let userId = req.user.data._id
            let candiMucTieu = req.body.candiMucTieu
            let updateUser = await functions.getDatafindOneAndUpdate(Users, { _id: userId }, {
                inForPerson: {
                    candiMucTieu: candiMucTieu,
                }
            })
            if (updateUser) {
                functions.success(res, "Cập nhật mục tiêu nghề nghiệp thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi Hoàn thiện hồ sơ qlc", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//cập nhật kỹ năng bản thân
exports.updateSkills = async(req, res, next) => {
    try {
        if (req.user && req.body.candiSkills) {

            let userId = req.user.data._id
            let candiSkills = req.body.candiSkills
            let updateUser = await functions.getDatafindOneAndUpdate(Users, { _id: userId }, {
                inForPerson: {
                    candiSkills: candiSkills,
                }
            })
            if (updateUser) {
                functions.success(res, "Cập nhật Kỹ năng bản thân thành công");
            }
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
        if (req.user && req.body.referencePersonName && req.body.referencePersonEmail &&
            req.body.referencePersonPhone && req.body.referencePersonPosition && req.body.referencePersonCompany) {

            let userId = req.user.data._id
            let referencePersonName = req.body.referencePersonName
            let referencePersonEmail = req.body.referencePersonEmail
            let referencePersonPhone = req.body.referencePersonPhone
            let referencePersonPosition = req.body.referencePersonPosition
            let referencePersonCompany = req.body.referencePersonCompany
            let updateUser = await functions.getDatafindOneAndUpdate(Users, { _id: userId }, {
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
            let userId = req.user.data._id
            let videoLink = req.body.videoLink
            if (req.file && !videoLink) {
                let videoName = req.file.filename
                let updateUser = await functions.getDatafindOneAndUpdate(Users, { _id: userId }, {
                    inForPerson: {
                        video: videoName,
                        videoType: 0
                    }
                })
                if (updateUser) {
                    functions.success(res, "Cập nhật Video giới thiệu bản thân thành công");
                }
            } else if (!req.body.file && videoLink) {
                let updateUser = await functions.getDatafindOneAndUpdate(Users, { _id: userId }, {
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
exports.updateDegree = async(req, res, next) => {
    try {
        if (req.user && req.body.candiSkills) {

            let userId = req.user.data._id
            let candiSkills = req.body.candiSkills
            let updateUser = await functions.getDatafindOneAndUpdate(Users, { _id: userId }, {
                inForPerson: {
                    candiSkills: candiSkills,
                }
            })
            if (updateUser) {
                functions.success(res, "Cập nhật Kỹ năng bản thân thành công");
            }
        } else {
            return functions.setError(res, "Token không hợp lệ hoặc thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật kỹ năng bản thân", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//làm mới hồ sơ
exports.RefreshProfile = async(req, res, next) => {
    try {
        if (req.user) {

            let userId = req.user.data._id
            let updateUser = await functions.getDatafindOneAndUpdate(Users, { _id: userId }, {
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
            let userId = req.user.data._id
            if (req.file) {
                let imageName = req.file.filename
                let updateUser = await functions.getDatafindOneAndUpdate(Users, { _id: userId }, {
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
        if (req.user && req.body.nameHoSo) {
            console.log(1)
            let userId = req.user.data._id
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