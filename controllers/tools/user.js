const Users = require('../../models/Users');
//mã hóa mật khẩu
const md5 = require('md5');

//token
const jwt = require('jsonwebtoken');

// Kết nối API
const axios = require('axios');

// Kết nối và sử dụng các hàm dùng chung
const fnc = require('../../services/functions');

// Xây dựng slug phục vụ sinh ra alias

const slug = require('slug');

exports.addUserChat365 = async(req, res, next) => {
    try {
        let count = 0,
            result = true;
        do {
            const getDataUser = await axios.post("http://43.239.223.142:9006/api/users/TakeDataUser", {
                count: count
            });

            let listUser = getDataUser.data.data.listUser;
            if (listUser.length > 0) {
                listUser.forEach(async element => {
                    let account = element.email,
                        type = element.type365,
                        name = element.userName,
                        password = element.password,
                        userName = element.userName,
                        avatarUser = element.avatarUser,
                        lastActive = element.lastActive,
                        id = element._id;

                    let CheckEmail = await fnc.checkEmail(account);
                    if (CheckEmail) {
                        var email = account;
                        var condition = { email: account, type };
                    } else {
                        var phoneTK = account;
                        var condition = { phoneTK: account, type };
                    }

                    let checkUser = await fnc.getDatafindOne(Users, condition);
                    if (checkUser == null) {
                        let checkUserByID = await fnc.getDatafindOne(Users, { _id: id });
                        if (checkUserByID == null) {
                            let user = new Users({
                                _id: id,
                                email,
                                phoneTK,
                                userName,
                                type,
                                password,
                                avatarUser,
                                lastActive,
                                isOnline: element.isOnline,
                                idTimViec365: element.idTimViec,
                                from: element.fromWeb,
                                chat365_secret: element.secretCode,
                                latitude: element.latitude,
                                longitude: element.longitude,
                            });
                            await user.save().then().catch(err => {
                                // console.log(err);
                            });
                        }
                    }
                });
                count += 20;
            } else result = false;
        }
        while (result)

        await fnc.success(res, 'thành công');

    } catch (e) {

    }

}

exports.addUserCompanyTimviec365 = async(req, res, next) => {
    try {

        let result = true,
            page = 1;

        do {
            const getData = await axios.get("https://timviec365.vn/api_nodejs/get_list_com.php?page=" + page),
                listUser = getData.data;

            if (listUser.length > 0) {
                listUser.forEach(async element => {
                    let email = element.usc_email,
                        phoneTK = element.usc_phone_tk;

                    if (email != null) {
                        var checkUser = await fnc.getDatafindOne(Users, { email, type: 1 });
                    } else {
                        var checkUser = await fnc.getDatafindOne(Users, { phoneTK, type: 1 });
                    }

                    var timeCreate = element.usc_create_time != 0 ? new Date(element.usc_create_time * 1000) : null,
                        timeUpdate = element.usc_update_time != 0 ? new Date(element.usc_update_time * 1000) : null,
                        timeLogin = element.usc_time_login != 0 ? new Date(element.usc_time_login * 1000) : null;

                    if (checkUser == null) {
                        let maxID = await fnc.getMaxID(Users);
                        const user = new Users({
                            _id: Number(maxID) + 1,
                            email,
                            phoneTK,
                            userName: element.usc_company,
                            alias: element.usc_alias,
                            phone: element.usc_phone,
                            avatarUser: element.usc_logo,
                            type: 1,
                            password: element.usc_pass,
                            city: element.usc_city,
                            district: element.usc_qh,
                            address: element.usc_address,
                            otp: element.usc_xac_thuc,
                            authentic: element.usc_authentic,
                            fromWeb: "timviec365",
                            from: element.dk,
                            createdAt: timeCreate,
                            updatedAt: timeUpdate,
                            time_login: timeLogin,
                            role: 1,
                            latitude: element.usc_lat,
                            longtitude: element.usc_long,
                            idQLC: element.id_qlc,
                            idTimViec365: element.usc_id,
                            idRaoNhanh365: 0,
                            chat365_secret: element.chat365_secret,
                            inForCompany: {
                                comViewCount: element.usc_view_count,
                                idKD: element.usc_kd,
                                canonical: element.usc_canonical,
                                website: element.usc_website,
                                mst: element.usc_mst,
                                ipAddressRegister: element.usc_ip,
                                userContactName: element.usc_name,
                                userContactAddress: element.usc_name_add,
                                userContactPhone: element.usc_name_phone,
                                userContactEmail: element.usc_name_email,
                                description: element.usc_company_info,
                                com_size: element.usc_size,
                                tagLinhVuc: element.usc_lv
                                    // linkVideo: element.usc_video,
                                    // videoType: element.usc_video_type,
                                    // videoActive: element.usc_video_active,
                                    // linkVideo: element.usc_video,
                                    // linkVideo: element.usc_video,
                            }
                        });
                        await user.save().then().catch(() => {

                        });
                    } else {
                        await Users.updateOne({ idTimViec365: element.usc_id, type: 1 }, {
                            $set: {
                                alias: element.usc_alias,
                                phone: element.usc_phone,
                                emailContact: element.usc_name_email,
                                avatarUser: element.usc_logo,
                                city: element.usc_city,
                                district: element.usc_qh,
                                address: element.usc_address,
                                otp: element.usc_xac_thuc,
                                authentic: element.usc_authentic,
                                fromWeb: "timviec365",
                                from: Number(element.dk),
                                createdAt: timeCreate,
                                updatedAt: timeUpdate,
                                time_login: timeLogin,
                                role: 1,
                                latitude: element.usc_lat,
                                longtitude: element.usc_long,
                                idQLC: element.id_qlc,
                                inForCompany: {
                                    comViewCount: element.usc_view_count,
                                    idKD: element.usc_kd,
                                    canonical: element.usc_canonical,
                                    website: element.usc_website,
                                    mst: element.usc_mst,
                                    ipAddressRegister: element.usc_ip,
                                    userContactName: element.usc_name,
                                    userContactAddress: element.usc_name_add,
                                    userContactPhone: element.usc_name_phone,
                                    userContactEmail: element.usc_name_email,
                                    description: element.usc_company_info,
                                    userContactEmail: element.usc_name,
                                    com_size: element.usc_size,
                                    tagLinhVuc: element.usc_lv
                                }
                            }
                        });
                    }
                });
                page++;
            } else result = false;
        } while (result)

        await fnc.success(res, 'thành công');

    } catch (error) {

    }
}

exports.addUserCandidateTimviec365 = async(req, res, next) => {
    try {
        let result = true,
            page = 1;
        const getData = await axios.get("https://timviec365.vn/api/get_list_user.php?page=1"),
            listUser = getData.data;
        listUser.forEach(async element => {
            let email = element.use_email,
                phoneTK = element.use_phone_tk;

            if (email != null) {
                var checkUser = await fnc.getDatafindOne(Users, {
                    $and: [{
                        $or: [
                            { type: 2 },
                            { type: 0 }
                        ]
                    }, { email }]
                });
            } else {
                var checkUser = await fnc.getDatafindOne(Users, {
                    $and: [{
                            $or: [
                                { type: 2 },
                                { type: 0 }
                            ]
                        },
                        { phoneTK }
                    ]
                });
            }

            if (checkUser == null) {
                let maxID = await fnc.getMaxID(Users);

                var timeCreate = element.use_create_time != 0 ? new Date(element.use_create_time * 1000) : null,
                    timeUpdate = element.use_update_time != 0 ? new Date(element.use_update_time * 1000) : null,
                    timebirthday = element.use_birth_day != 0 ? new Date(element.use_birth_day * 1000) : null;

                const user = new Users({
                    _id: Number(maxID) + 1,
                    email,
                    phoneTK,
                    userName: element.use_first_name,
                    alias: slug(element.use_first_name),
                    phone: element.use_phone,
                    avatarUser: element.use_logo,
                    type: 0,
                    password: element.use_pass,
                    city: element.use_city,
                    district: element.use_quanhuyen,
                    address: element.use_address,
                    otp: element.user_xac_thuc,
                    authentic: element.use_authentic,
                    fromWeb: "timviec365",
                    from: element.dk,
                    createdAt: timeCreate,
                    updatedAt: timeUpdate,
                    role: 0,
                    latitude: element.use_lat,
                    longtitude: element.use_long,
                    idQLC: element.id_qlc,
                    idTimViec365: element.use_id,
                    idRaoNhanh365: 0,
                    chat365_secret: element.chat365_secret,
                    inForPerson: {
                        candiTitle: element.cv_title,
                        candiCityID: element.cv_city_id,
                        candiCateID: element.cv_cate_id,
                        birthday: timebirthday,
                        gender: element.use_gioi_tinh,
                        married: element.use_hon_nhan,
                        exp: element.cv_exp,
                        candiHocVan: element.cv_hocvan,
                        candiMucTieu: element.cv_muctieu,
                        candiCapBac: element.cv_capbac_id,
                        candiMoney: element.cv_money_id,
                        candiLoaiHinh: element.cv_loaihinh_id,
                        referencePersonName: element.cv_tc_name,
                        referencePersonEmail: element.cv_tc_email,
                        referencePersonPhone: element.cv_tc_phone,
                        referencePersonPosition: element.cv_tc_cv,
                        referencePersonAddress: element.cv_tc_dc,
                        referencePersonCompany: element.cv_tc_company
                    }
                });
                await user.save().then().catch(() => {

                });
            } else {

            }
            console.log(checkUser);

        });
        await fnc.success(res, 'thành công');
    } catch (error) {

    }
}


exports.deleteUser = async(req, res, next) => {
    Users.deleteMany()
        .then(() => fnc.success(res, "Xóa thành công"))
        .catch(() => fnc.setError(res, "Có lỗi xảy ra"))
}