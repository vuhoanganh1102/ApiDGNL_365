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

exports.addUserChat365 = async (req, res, next) => {
    try {
        let count = 0,
            result = true;
        do {
            const getDataUser = await axios.post("http://43.239.223.142:9006/api/users/TakeDataUser", {
                count: count
            });

            let listUser = getDataUser.data.data.listUser;
            if (listUser.length > 0) {
                var total = 0;
                for (let i = 0; i < listUser.length; i++) {
                    let element = listUser[i];

                    let CheckEmail = await fnc.checkEmail(element.email);
                    if (CheckEmail) {
                        var email = element.email;
                        var phoneTK = null;
                    } else {
                        var phoneTK = element.email;
                        var email = null;
                    }

                    let user = new Users({
                        _id: element._id,
                        email,
                        phoneTK,
                        userName: element.userName,
                        type: element.type365,
                        password: element.password,
                        avatarUser: element.avatarUser,
                        lastActivedAt: element.lastActivedAt,
                        isOnline: element.isOnline,
                        idTimViec365: element.idTimViec,
                        fromWeb: element.fromWeb,
                        chat365_secret: element.secretCode,
                        latitude: element.latitude,
                        longitude: element.longitude,
                        configChat: {
                            notificationAcceptOffer: element.notificationAcceptOffer,
                            notificationAllocationRecall: element.notificationAllocationRecall,
                            notificationChangeSalary: element.notificationChangeSalary,
                            notificationCommentFromRaoNhanh: element.notificationCommentFromRaoNhanh,
                            notificationCommentFromTimViec: element.notificationCommentFromTimViec,
                            notificationDecilineOffer: element.notificationDecilineOffer,
                            notificationMissMessage: element.notificationMissMessage,
                            notificationNTDExpiredPin: element.notificationNTDExpiredPin,
                            notificationNTDExpiredRecruit: element.notificationNTDExpiredRecruit,
                            notificationNTDPoint: element.notificationNTDPoint,
                            notificationSendCandidate: element.notificationSendCandidate,
                            notificationTag: element.notificationTag,
                            HistoryAccess: element.HistoryAccess,
                            removeSugges: element.removeSugges,
                            userNameNoVn: element.userNameNoVn,
                            doubleVerify: element.doubleVerify
                        }
                    });
                    await user.save().then(() => {
                        console.log("Thêm mới thành công " + account);
                    }).catch(err => {
                        // console.log("ID là: " + element._id, checkUserByID, err);
                    });
                };

                count += 1000;
                console.log("Đã quét " + count);
                // result = false
            } else result = false;
        }
        while (result)

        await fnc.success(res, 'thành công');

    } catch (e) {
        console.log(e);
    }

}

exports.addUserCompanyTimviec365 = async (req, res, next) => {
    try {

        let result = true,
            page = 1;

        do {
            const getData = await axios.get("https://timviec365.vn/api_nodejs/get_list_com.php?page=" + page),
                listUser = getData.data;

            if (listUser.length > 0) {
                for (let i = 0; i < listUser.length; i++) {
                    let element = listUser[i];
                    let email = element.usc_email,
                        phoneTK = element.usc_phone_tk;

                    if (email != null) {
                        var User = await fnc.getDatafindOne(Users, { email, type: 1 });
                    } else {
                        var User = await fnc.getDatafindOne(Users, { phoneTK, type: 1 });
                    }
                    var timeCreate = element.usc_create_time != 0 ? new Date(element.usc_create_time * 1000) : null,
                        timeUpdate = element.usc_update_time != 0 ? new Date(element.usc_update_time * 1000) : null,
                        timeLogin = element.usc_time_login != 0 ? new Date(element.usc_time_login * 1000) : null;
                    if (User != null) {
                        await Users.updateOne({ _id: User._id }, {
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
                                fromDevice: Number(element.dk),
                                createdAt: timeCreate,
                                updatedAt: timeUpdate,
                                time_login: timeLogin,
                                role: 1,
                                latitude: element.usc_lat,
                                longtitude: element.usc_long,
                                idQLC: element.id_qlc,
                                idTimViec365: element.usc_id,
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
                        }).then(() => {
                            // console.log("Cập nhật thành công user " + User.email);
                        }).catch(err => {
                            // console.log(err);
                        });
                    }
                    //  else {
                    //     let maxID = await fnc.getMaxID(Users);
                    //     const user = new Users({
                    //         _id: Number(maxID) + 1,
                    //         email,
                    //         phoneTK,
                    //         userName: element.usc_company,
                    //         alias: element.usc_alias,
                    //         phone: element.usc_phone,
                    //         avatarUser: element.usc_logo,
                    //         type: 1,
                    //         password: element.usc_pass,
                    //         city: element.usc_city,
                    //         district: element.usc_qh,
                    //         address: element.usc_address,
                    //         otp: element.usc_xac_thuc,
                    //         authentic: element.usc_authentic,
                    //         fromWeb: "timviec365",
                    //         from: element.dk,
                    //         createdAt: timeCreate,
                    //         updatedAt: timeUpdate,
                    //         time_login: timeLogin,
                    //         role: 1,
                    //         latitude: element.usc_lat,
                    //         longtitude: element.usc_long,
                    //         idQLC: element.id_qlc,
                    //         idTimViec365: element.usc_id,
                    //         idRaoNhanh365: 0,
                    //         chat365_secret: element.chat365_secret,
                    //         inForCompany: {
                    //             comViewCount: element.usc_view_count,
                    //             idKD: element.usc_kd,
                    //             canonical: element.usc_canonical,
                    //             website: element.usc_website,
                    //             mst: element.usc_mst,
                    //             ipAddressRegister: element.usc_ip,
                    //             userContactName: element.usc_name,
                    //             userContactAddress: element.usc_name_add,
                    //             userContactPhone: element.usc_name_phone,
                    //             userContactEmail: element.usc_name_email,
                    //             description: element.usc_company_info,
                    //             com_size: element.usc_size,
                    //             tagLinhVuc: element.usc_lv
                    //         }
                    //     });
                    //     await user.save().then(() => {
                    //         // console.log("Thêm mới thành công id: " + idTimViec365);
                    //     }).catch(() => {

                    //     });
                    // }
                };
                page++;
                console.log(page);
            } else result = false;
        }
        while (result)

        await fnc.success(res, 'thành công');

    } catch (error) {
        console.log(error);
    }
}

exports.addUserCandidateTimviec365 = async (req, res, next) => {
    try {
        let result = true,
            page = 1;
        // "https://timviec365.vn/api_nodejs/get_list_user.php?page=" + page + "&curentPage=200"
        do {
            const getData = await axios.get("https://timviec365.vn/api_nodejs/get_list_user.php?page=" + page + "&curentPage=200"),
                listUser = getData.data;

            if (listUser.length > 0) {
                for (let i = 0; i < listUser.length; i++) {

                    let element = listUser[i];
                    let email = element.use_email,
                        phoneTK = element.use_phone_tk;

                    if (email != null) {
                        var User = await fnc.getDatafindOne(Users, {
                            $and: [{
                                $or: [
                                    { type: 2 },
                                    { type: 0 }
                                ]
                            }, { email }]
                        });
                    } else {
                        var User = await fnc.getDatafindOne(Users, {
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

                    var timeCreate = element.use_create_time != 0 ? new Date(element.use_create_time * 1000) : null,
                        timeUpdate = element.use_update_time != 0 ? new Date(element.use_update_time * 1000) : null,
                        timebirthday = element.use_birth_day != 0 ? new Date(element.use_birth_day * 1000) : null;

                    if (User != null) {
                        await Users.updateOne({ _id: User._id }, {
                            $set: {
                                phone: element.use_phone,
                                emailContact: element.use_email_lienhe,
                                avatarUser: element.use_logo,
                                city: element.use_city,
                                district: element.use_quanhuyen,
                                address: element.use_address,
                                otp: element.user_xac_thuc,
                                authentic: element.usc_authentic,
                                from: Number(element.dk),
                                createdAt: timeCreate,
                                updatedAt: timeUpdate,
                                role: 2,
                                latitude: element.use_lat,
                                longtitude: element.use_long,
                                idQLC: element.id_qlc,
                                idTimViec365: element.use_id,
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
                            }
                        }).then(() => {
                            // console.log("Cập nhật thành công ID:" + User._id);
                        }).catch(err => {
                            console.log(err);
                        });
                    }
                };
                page++;
                console.log(page);
            } else {
                result = false
            }
        } while (!result);

        await fnc.success(res, 'thành công');
    } catch (error) {
        console.log(error);
    }
}

exports.deleteUser = async (req, res, next) => {
    Users.deleteMany()
        .then(() => fnc.success(res, "Xóa thành công"))
        .catch(() => fnc.setError(res, "Có lỗi xảy ra"))
}

exports.test = async (req, res, next) => {
    fnc.setError(res, "Có lỗi xảy ra");
}


exports.addInforRaoNhanh365 = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        while (result) {
            let reponse = await axios({
                method: 'post',
                url: 'https://raonhanh365.vn/api/select_user_personal.php',
                headers: { "Content-Type": "multipart/form-data" },
                data: {
                    page: page
                }
            });
            if (reponse.data.data.items.length === 0) {
                result = false
            }
            let dataRaoNhanh = reponse.data.data.items; 
            for (let i = 0; i < dataRaoNhanh.length; i++) {
                let check = await Users.findById(dataRaoNhanh[i].chat365_id);
                if(!check) continue
                
                if (await fnc.checkDate(dataRaoNhanh[i].tgian_xacthuc) === false) {
                    continue
                }
                console.log('update ',dataRaoNhanh[i].chat365_id)
                console.log('đã update',page * dataRaoNhanh.length)
                console.log('còn lại',98000 - page * dataRaoNhanh.length)
                await Users.findByIdAndUpdate(dataRaoNhanh[i].chat365_id, {
                    idRaoNhanh365: dataRaoNhanh[i].usc_id,
                    authentic: dataRaoNhanh[i].usc_authentic,
                    chat365_secret: dataRaoNhanh[i].chat365_secret,
                    inforRN365: {
                        cccd: dataRaoNhanh[i].usc_cmt,
                        cccdFrontImg: dataRaoNhanh[i].anh_cmt_mtr,
                        cccdBackImg: dataRaoNhanh[i].anh_cmt_ms,
                        bankName: dataRaoNhanh[i].ten_nganhang,
                        stk: dataRaoNhanh[i].so_taikhoan,
                        xacThucLienket: dataRaoNhanh[i].xacthuc_lket,
                        store_name: dataRaoNhanh[i].usc_store_name,
                        ownerName: dataRaoNhanh[i].chu_taikhoan,
                        time: new Date(dataRaoNhanh[i].tgian_xacthuc),
                        active: dataRaoNhanh[i].xacthuc_lket,
                        store_phone: dataRaoNhanh[i].usc_store_phone
                    }
                })
            }
            page++;
            console.log(page)
        }
        return fnc.success(res, 'thành công');
    } catch (error) {
        console.log(error)
    }
}