const Users = require('../../models/Users');
const Profile = require('../../models/Timviec365/UserOnSite/Candicate/Profile');
const SaveCvCandi = require('../../models/Timviec365/UserOnSite/Candicate/SaveCvCandi');

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

// Đẩy data bằng form-data
const FormData = require('form-data');

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
                var total = 0;

                for (let i = 0; i < listUser.length; i++) {
                    let element = listUser[i];
                    if (element.email != null && element.email.trim() != "") {
                        if (element.email.indexOf('@') != -1) {
                            var email = element.email.trim();
                            var phoneTK = null;
                        } else {
                            var phoneTK = element.email.trim();
                            var email = null;
                        }

                        const user = new Users({
                            _id: element._id,
                            email,
                            phoneTK,
                            userName: element.userName,
                            phone: element.phone,
                            avatarUser: element.avatarUser,
                            type: element.type365,
                            password: element.password,
                            isOnline: element.isOnline,
                            fromWeb: element.fromWeb,
                            lastActivedAt: element.lastActive,
                            latitude: element.latitude,
                            longtitude: element.longtitude,
                            idQLC: element.id365,
                            idTimViec365: element.idTimViec,
                            chat365_secret: element.secretCode,
                            sharePermissionId: element.sharePermissionId,
                            acceptMessStranger: element.acceptMessStranger,
                            configChat: {
                                HistoryAccess: element.HistoryAccess,
                                removeSugges: element.removeSugges,
                                userNameNoVn: element.userNameNoVn,
                                doubleVerify: element.doubleVerify,
                                status: element.status
                            }
                        });
                        await user.save().then().catch(error => {
                            console.log(error);
                        });
                    }
                };

                count += 1000;
                console.log("Đã quét " + count);
                // result = false
            } else result = false;
        }
        while (result)

        return fnc.success(res, 'thành công');

    } catch (e) {
        console.log(e);
        return fnc.setError(res, e);
    }

}

exports.addUserCompanyTimviec365 = async(req, res, next) => {
    try {

        let result = true,
            page = 1,
            dataUpdate = {},
            inForCompany = {};

        do {
            // Lấy 1000 công ty
            const listUser = await Users.find({ type: 1, inForCompany: null, scan: null })
                .limit(1000)
                .skip((page - 1) * 1000)
                .sort({ _id: -1 })
                .lean();
            if (listUser.length > 0) {
                for (let i = 0; i < listUser.length; i++) {
                    const userChat = listUser[i];
                    let dataUpdate = { scan: 1 },
                        inForCompany = {};
                    if (userChat.email != null || userChat.phoneTK != null) {
                        if (userChat.email == null && userChat.phoneTK != null && userChat.phoneTK.indexOf('@') != -1) {
                            await Users.updateOne({ _id: userChat._id }, {
                                    $set: {
                                        email: userChat.phoneTK.trim(),
                                        phoneTK: null
                                    }
                                }).then(result => {
                                    // Xử lý kết quả thành công
                                    console.log('Bản ghi đã được cập nhật email');
                                })
                                .catch(error => {
                                    // Xử lý lỗi
                                    console.error('Lỗi khi cập nhật email bản ghi:', error);
                                });

                            continue;
                        }

                        // Lây data từ tìm việc
                        const formDataCom = new FormData();
                        formDataCom.append('idTimviec', userChat.idTimViec365);
                        formDataCom.append('idChat', userChat._id);
                        if (userChat.email != null) {
                            formDataCom.append('email', userChat.email);
                        }

                        const getComTv365 = await axios.post("https://timviec365.vn/api/get_ntd_idchat.php", formDataCom);
                        const comTv365 = getComTv365.data.data.data;

                        if (comTv365) {
                            var timeCreate = comTv365.usc_create_time != 0 ? new Date(comTv365.usc_create_time * 1000) : null,
                                timeUpdate = comTv365.usc_update_time != 0 ? new Date(comTv365.usc_update_time * 1000) : null,
                                timeLogin = comTv365.usc_time_login != 0 ? new Date(comTv365.usc_time_login * 1000) : null;

                            dataUpdate.alias = comTv365.usc_alias;
                            dataUpdate.phone = comTv365.usc_phone;
                            dataUpdate.emailContact = comTv365.usc_name_email;
                            dataUpdate.avatarUser = comTv365.usc_logo;
                            dataUpdate.city = comTv365.usc_city;
                            dataUpdate.district = comTv365.usc_qh;
                            dataUpdate.address = comTv365.usc_address;
                            dataUpdate.otp = comTv365.usc_xac_thuc;
                            dataUpdate.authentic = comTv365.usc_authentic;
                            dataUpdate.fromDevice = Number(comTv365.dk);
                            dataUpdate.createdAt = comTv365.usc_create_time;
                            dataUpdate.updatedAt = comTv365.usc_update_time;
                            dataUpdate.time_login = comTv365.usc_time_login;
                            dataUpdate.role = 1;
                            dataUpdate.latitude = comTv365.usc_lat;
                            dataUpdate.longtitude = comTv365.usc_long;
                            dataUpdate.idQLC = comTv365.id_qlc;
                            dataUpdate.idTimViec365 = comTv365.usc_id;

                            inForCompany = {
                                usc_kd: comTv365.usc_kd,
                                usc_kd_first: comTv365.usc_kd_first,
                                description: comTv365.usc_company_info,
                                com_size: comTv365.usc_size,
                                timviec365: {
                                    usc_name: comTv365.usc_name,
                                    usc_name_add: comTv365.usc_name_add,
                                    usc_name_phone: comTv365.usc_name_phone,
                                    usc_name_email: comTv365.usc_name_email,
                                    usc_canonical: comTv365.usc_canonical,
                                    usc_md5: comTv365.usc_md5,
                                    usc_redirect: comTv365.usc_redirect,
                                    usc_type: comTv365.usc_type,
                                    usc_website: comTv365.usc_website,
                                    usc_view_count: comTv365.usc_view_count,
                                    usc_active: comTv365.usc_active,
                                    usc_show: comTv365.usc_show,
                                    usc_mail: comTv365.usc_mail,
                                    usc_stop_mail: comTv365.usc_stop_mail,
                                    usc_utl: comTv365.usc_utl,
                                    usc_ssl: comTv365.usc_ssl,
                                    usc_mst: comTv365.usc_mst,
                                    usc_security: comTv365.usc_security,
                                    usc_ip: comTv365.usc_ip,
                                    usc_loc: comTv365.usc_loc,
                                    usc_mail_app: comTv365.usc_mail_app,
                                    usc_block_account: comTv365.usc_block_account,
                                    usc_stop_noti: comTv365.usc_stop_noti,
                                    otp_time_exist: comTv365.otp_time_exist,
                                    use_test: comTv365.use_test,
                                    usc_map: comTv365.usc_map,
                                    usc_dgc: comTv365.usc_dgc,
                                    usc_dg_time: comTv365.usc_dg_time,
                                    usc_skype: comTv365.usc_skype,
                                    usc_video_com: comTv365.usc_video_com,
                                    usc_badge: comTv365.usc_badge,
                                    usc_dgc: comTv365.usc_dgc,
                                    usc_dgtv: comTv365.usc_dgtv,
                                    usc_lv: comTv365.usc_lv
                                }
                            }
                        }

                        const formDataQLC = new FormData();
                        if (userChat.email != null) {
                            formDataQLC.append('email', userChat.email);
                        } else {
                            formDataQLC.append('email', userChat.phoneTK);
                        }

                        formDataQLC.append('type', 1);
                        const getCompanyQLC = await axios.post("https://chamcong.24hpay.vn/api_timviec/get_infor_by_email.php", formDataQLC);
                        const companyQLC = getCompanyQLC.data.company;
                        if (companyQLC) {
                            if (!dataUpdate.createdAt) {
                                dataUpdate.createdAt = new Date(companyQLC.com_create_time).getTime() / 1000;
                            }
                            if (!dataUpdate.updatedAt) {
                                dataUpdate.updatedAt = new Date(companyQLC.com_update_time).getTime() / 1000;
                            }

                            inForCompany.cds = {
                                com_parent_id: companyQLC.com_parent_id,
                                type_timekeeping: companyQLC.type_timekeeping,
                                id_way_timekeeping: companyQLC.id_way_timekeeping,
                                com_role_id: companyQLC.com_role_id,
                                com_qr_logo: companyQLC.com_qr_logo,
                                enable_scan_qr: companyQLC.enable_scan_qr,
                                com_vip: companyQLC.com_vip,
                                com_ep_vip: companyQLC.com_ep_vip,
                                com_vip_time: companyQLC.com_quantity_time,
                                ep_crm: companyQLC.ep_crm,
                                ep_stt: companyQLC.com_kd,
                            };
                        }
                    }
                    inForCompany.scan = 1;
                    dataUpdate.inForCompany = inForCompany;
                    await Users.updateOne({ _id: userChat._id }, {
                            $set: dataUpdate
                        }).then(result => {
                            // Xử lý kết quả thành công
                            // console.log('Bản ghi đã được cập nhật');
                        })
                        .catch(error => {
                            // Xử lý lỗi
                            // console.error('Lỗi khi cập nhật bản ghi:', error);
                        });
                }
            } else result = false;
            page++;
            console.log(page);
        }

        while (result);

        await fnc.success(res, 'thành công');

    } catch (error) {
        console.log(error);
        return await fnc.setError(res, error.message);
    }
}

exports.addUserCandidateTimviec365 = async(req, res) => {
    try {
        let result = true,
            page = 1,
            pageSize = 1000,
            dataUpdate = {},
            inForPerson = {};

        do {
            // Lấy 1000 bản ghi
            const listUser = await Users.find({ type: { $ne: 1 }, inForPerson: null })
                .sort({ _id: -1 })
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .lean();
            if (listUser.length > 0) {
                for (let i = 0; i < listUser.length; i++) {
                    const userChat = listUser[i];
                    let dataUpdate = {},
                        inForPerson = {};
                    if (userChat.email != null || userChat.phoneTK != null) {
                        if (userChat.email == null && userChat.phoneTK != null && userChat.phoneTK.indexOf('@') != -1) {
                            await Users.updateOne({ _id: userChat._id }, {
                                    $set: {
                                        email: userChat.phoneTK.trim(),
                                        phoneTK: null
                                    }
                                }).then(result => {
                                    // Xử lý kết quả thành công
                                    console.log('Bản ghi đã được cập nhật email');
                                })
                                .catch(error => {
                                    // Xử lý lỗi
                                    console.error('Lỗi khi cập nhật email bản ghi:', error);
                                });

                            continue;
                        }
                        const formDataTV = new FormData();
                        formDataTV.append('idChat', userChat._id);
                        if (userChat.email != null) {
                            formDataTV.append('email', userChat.email);
                        } else {
                            formDataTV.append('phoneTK', userChat.phoneTK);
                        }



                        const candidate = await axios.post("https://timviec365.vn/api/get_uv_idchat.php", formDataTV);
                        const element = candidate.data.data.data;
                        if (element) {
                            var timeCreate = element.use_create_time != 0 ? new Date(element.use_create_time * 1000) : null,
                                timeUpdate = element.use_update_time != 0 ? new Date(element.use_update_time * 1000) : null,
                                timebirthday = element.use_birth_day != 0 ? new Date(element.use_birth_day * 1000) : null;

                            dataUpdate.createdAt = element.use_create_time;
                            dataUpdate.updatedAt = element.use_update_time;
                            inForPerson = {
                                account: {
                                    birthday: element.use_birth_day,
                                    gender: element.use_gioi_tinh,
                                    married: element.use_hon_nhan,
                                    exp: element.cv_exp,
                                    education: element.cv_hocvan,
                                },
                                candidate: {
                                    use_type: element.use_type,
                                    user_reset_time: element.user_reset_time,
                                    use_view: element.use_view,
                                    use_noti: element.use_noti,
                                    use_show: element.use_show,
                                    use_show_cv: element.use_show_cv,
                                    use_td: element.use_td,
                                    use_check: element.use_check,
                                    use_test: element.use_test,
                                    point_time_active: element.point_time_active,
                                    cv_title: element.cv_title,
                                    cv_muctieu: element.cv_muctieu,
                                    cv_kynang: element.cv_kynang,
                                    cv_city_id: element.cv_city_id.split(',').map(Number),
                                    cv_cate_id: element.cv_cate_id.split(',').map(Number),
                                    cv_capbac_id: element.cv_capbac_id,
                                    cv_money_id: element.cv_money_id,
                                    cv_loaihinh_id: element.cv_loaihinh_id,
                                    cv_tc_name: element.cv_tc_name,
                                    cv_tc_email: element.cv_tc_email,
                                    cv_tc_phone: element.cv_tc_phone,
                                    cv_tc_cv: element.cv_tc_cv,
                                    cv_tc_dc: element.cv_tc_dc,
                                    cv_tc_company: element.cv_tc_company,
                                    cv_video: element.cv_video,
                                    cv_video_type: element.cv_video_type,
                                    cv_video_active: element.cv_video_active,
                                    um_unit: element.um_unit,
                                    um_type: element.um_type,
                                    um_min_value: element.um_min_value,
                                    um_max_value: element.um_max_value,
                                }
                            };

                            inForPerson.candidate.profileExperience = [];
                            for (var j = 0; j < element.kinh_nghiem.length; j++) {
                                const itemkn = element.kinh_nghiem[j];
                                inForPerson.candidate.profileExperience.push({
                                    kn_id: itemkn.kn_id,
                                    kn_name: itemkn.kn_name,
                                    kn_cv: itemkn.kn_cv,
                                    kn_mota: itemkn.kn_mota,
                                    kn_one_time: itemkn.kn_one_time,
                                    kn_two_time: itemkn.kn_two_time,
                                    kn_hien_tai: itemkn.kn_hien_tai,
                                });

                            }

                            inForPerson.candidate.profileDegree = [];
                            for (var j = 0; j < element.bang_cap.length; j++) {
                                const itembc = element.bang_cap[j];
                                inForPerson.candidate.profileDegree.push({
                                    th_id: itembc.th_id,
                                    th_name: itembc.th_name,
                                    th_bc: itembc.th_bc,
                                    th_cn: itembc.th_cn,
                                    th_one_time: itembc.th_one_time,
                                    th_two_time: itembc.th_two_time,
                                    th_xl: itembc.th_xl,
                                    th_bs: itembc.th_bs,
                                });
                            }

                            inForPerson.candidate.profileNgoaiNgu = [];
                            for (var j = 0; j < element.ngoai_ngu.length; j++) {
                                const itemnn = element.ngoai_ngu[j];
                                inForPerson.candidate.profileNgoaiNgu.push({
                                    nn_id: itemnn.nn_id,
                                    nn_id_pick: itemnn.nn_id_pick,
                                    nn_cc: itemnn.nn_cc,
                                    nn_sd: itemnn.nn_sd
                                });
                            }

                            inForPerson.candidate.profileUpload = [];
                            for (var j = 0; j < element.ho_so.length; j++) {
                                const itemhs = element.ho_so[j];
                                inForPerson.candidate.profileUpload.push({
                                    hs_id: itemhs.hs_id,
                                    hs_name: itemhs.hs_name,
                                    hs_link: itemhs.hs_link,
                                    hs_cvid: itemhs.hs_cvid,
                                    hs_create_time: itemhs.hs_create_time,
                                    hs_active: itemhs.hs_active,
                                    hs_link_hide: itemhs.hs_link_hide,
                                    is_scan: itemhs.is_scan,
                                    hs_link_error: itemhs.hs_link_error,
                                    state: itemhs.state,
                                    mdtd_state: itemhs.mdtd_state
                                });
                            }
                        }

                        if (userChat.fromWeb == 'quanlychung365') {
                            const formDataEmp = new FormData();
                            if (userChat.email != null) {
                                formDataEmp.append('email', userChat.email);
                            } else {
                                formDataEmp.append('email', userChat.phoneTK);
                            }

                            formDataEmp.append('type', 2);
                            const getEmployee = await axios.post("https://chamcong.24hpay.vn/api_timviec/get_infor_by_email.php", formDataEmp);

                            const employee = getEmployee.data.employee;
                            if (employee) {
                                if (!dataUpdate.createdAt) {
                                    dataUpdate.createdAt = new Date(employee.create_time).getTime() / 1000;
                                }

                                inForPerson.account = {
                                    birthday: new Date(employee.ep_birth_day).getTime(),
                                    gender: employee.ep_gender,
                                    married: employee.ep_married,
                                    experience: employee.ep_exp,
                                    education: employee.ep_education,
                                };
                                inForPerson.employee = {
                                    com_id: employee.com_id,
                                    dep_id: employee.dep_id,
                                    start_working_time: employee.start_working_time,
                                    position_id: employee.position_id,
                                    group_id: employee.group_id,
                                    time_quit_job: employee.update_time,
                                    ep_description: employee.ep_description,
                                    ep_featured_recognition: employee.ep_featured_recognition,
                                    ep_status: employee.ep_status,
                                    ep_signature: employee.ep_signature,
                                    allow_update_face: employee.allow_update_face,
                                    version_in_use: employee.version_in_use,
                                };
                            }

                        };
                        inForPerson.scan = 1;
                        dataUpdate.inForPerson = inForPerson;
                        await Users.updateOne({ _id: userChat._id }, {
                                $set: dataUpdate
                            }).then(result => {
                                // Xử lý kết quả thành công
                                console.log('Bản ghi đã được cập nhật' + userChat._id);
                            })
                            .catch(error => {
                                // Xử lý lỗi
                                // console.error('Lỗi khi cập nhật bản ghi:', error);
                            });
                    }
                }
                console.log(page);
                page++;
            } else result = false;



        }
        while (result);
    } catch (error) {
        console.log(error);
        return await fnc.setError(res, error.message);
    }
}

exports.deleteUser = async(req, res, next) => {
    Users.deleteMany()
        .then(() => fnc.success(res, "Xóa thành công"))
        .catch(() => fnc.setError(res, "Có lỗi xảy ra"))
}

exports.test = async(req, res, next) => {
    fnc.setError(res, "Có lỗi xảy ra");
}

exports.resetScan = async(req, res) => {
    Users.updateMany({}, {
        $set: {
            scan: 0
        }
    });
    fnc.success(res, "Thành công");
}

exports.addCompanyTv365 = async(req, res) => {
    const request = req.body;

    const idChat = Number(request.chat365_id);
    let condition = {};
    if (request.usc_email != "") {
        condition = { email: request.usc_email, type: 1 };
    } else {
        condition = { phoneTK: request.usc_phone_tk, type: 1 };
    }
    const check = await Users.findOne(condition);
    if (check) {
        const data = {
            email: request.usc_email,
            phoneTK: request.usc_phone_tk,
            alias: request.usc_alias,
            city: request.usc_city,
            district: request.usc_qh,
            address: request.usc_address,
            phone: request.usc_phone,
            otp: request.usc_xac_thuc,
            authentic: request.usc_authentic,
            fromDevice: request.dk,
            createdAt: request.usc_create_time,
            updatedAt: request.usc_update_time,
            time_login: request.usc_time_login,
            latitude: request.usc_lat,
            longtitude: request.usc_long,
            idTimViec365: request.usc_id,
            inForCompany: {
                usc_kd: request.usc_kd,
                usc_kd_first: request.usc_kd_first,
                description: request.usc_company_info,
                com_size: request.usc_size,
                timviec365: {
                    usc_name: request.usc_name,
                    usc_name_add: request.usc_name_add,
                    usc_name_phone: request.usc_name_phone,
                    usc_name_email: request.usc_name_email,
                    usc_update_new: request.usc_update_new,
                    usc_canonical: request.usc_canonical,
                    usc_md5: request.usc_md5,
                    usc_redirect: request.usc_redirect,
                    usc_type: request.usc_type,
                    usc_size: request.usc_size,
                    usc_website: request.usc_website,
                    usc_view_count: request.usc_view_count,
                    usc_active: request.usc_active,
                    usc_show: request.usc_show,
                    usc_mail: request.usc_mail,
                    usc_stop_mail: request.usc_stop_mail,
                    usc_utl: request.usc_utl,
                    usc_ssl: request.usc_ssl,
                    usc_mst: request.usc_mst,
                    usc_security: request.usc_security,
                    usc_ip: request.usc_ip,
                    usc_loc: request.usc_loc,
                    usc_mail_app: request.usc_mail_app,
                    usc_video: request.usc_video,
                    usc_video_type: request.usc_video_type,
                    usc_video_active: request.usc_video_active,
                    usc_block_account: request.usc_block_account,
                    usc_stop_noti: request.usc_stop_noti,
                    otp_time_exist: request.otp_time_exist,
                    use_test: request.use_test,
                    usc_badge: request.usc_badge,
                    usc_map: request.usc_map,
                    usc_dgc: request.usc_dgc,
                    usc_dgtv: request.usc_dgtv,
                    usc_dg_time: request.usc_dg_time,
                    usc_skype: request.usc_skype,
                    usc_video_com: request.usc_video_com,
                    usc_lv: request.usc_lv,
                }
            }
        }
        await Users.updateOne({
            _id: check._id
        }, {
            $set: data
        });
        return fnc.success(res, "Thành công");
    } else {
        return fnc.setError(res, "Không tồn tại");
    }

}

exports.addCandidateTv365 = async(req, res) => {
    try {
        const request = req.body;

        const use_id = Number(request.use_id);
        const user = await Users.findOne({
            idTimViec365: Number(use_id),
            type: { $ne: 1 }
        });

        if (user) {
            let data;
            if (user.inForPerson == null) {
                data = {
                    email: request.use_email,
                    phoneTK: request.use_phone_tk,
                    city: request.use_city,
                    district: request.use_quanhuyen,
                    address: request.use_address,
                    phone: request.use_phone,
                    otp: request.user_xac_thuc,
                    authentic: request.use_authentic,
                    fromDevice: request.dk,
                    createdAt: request.use_create_time,
                    updatedAt: request.use_update_time,
                    latitude: request.use_lat,
                    longtitude: request.use_long,
                    idTimViec365: request.use_id,
                    inForPerson: {
                        account: {
                            birthday: request.use_birth_day,
                            gender: request.use_gioi_tinh,
                            married: request.use_hon_nhan,
                            experience: request.cv_exp,
                            education: request.cv_hocvan,
                        },
                        candidate: {
                            use_type: request.use_type,
                            user_reset_time: request.user_reset_time,
                            use_view: request.use_view,
                            use_noti: request.use_noti,
                            use_show: request.use_show,
                            use_show_cv: request.use_show_cv,
                            use_active: request.use_active,
                            use_td: request.use_td,
                            use_check: request.use_check,
                            use_test: request.use_test,
                            point_time_active: request.point_time_active,
                            cv_title: request.cv_title,
                            cv_muctieu: request.cv_muctieu,
                            cv_city_id: request.cv_city_id.split(",").map(Number),
                            cv_cate_id: request.cv_cate_id.split(",").map(Number),
                            cv_capbac_id: request.cv_capbac_id,
                            cv_money_id: request.cv_money_id,
                            cv_loaihinh_id: request.cv_loaihinh_id,
                            cv_time: request.cv_time,
                            cv_time_dl: request.cv_time_dl,
                            cv_kynang: request.cv_kynang,
                            um_type: request.um_type,
                            um_min_value: request.um_min_value,
                            um_max_value: request.um_max_value,
                            um_unit: request.um_unit,
                            cv_tc_name: request.cv_tc_name,
                            cv_tc_cv: request.cv_tc_cv,
                            cv_tc_dc: request.cv_tc_dc,
                            cv_tc_phone: request.cv_tc_phone,
                            cv_tc_email: request.cv_tc_email,
                            cv_tc_company: request.cv_tc_company,
                            cv_video: request.cv_video,
                            cv_video_type: request.cv_video_type,
                            cv_video_active: request.cv_video_active
                        }
                    }
                }
            } else {
                data = {
                    email: request.use_email,
                    phoneTK: request.use_phone_tk,
                    city: request.use_city,
                    district: request.use_quanhuyen,
                    address: request.use_address,
                    phone: request.use_phone,
                    otp: request.user_xac_thuc,
                    authentic: request.use_authentic,
                    fromDevice: request.dk,
                    createdAt: request.use_create_time,
                    updatedAt: request.use_update_time,
                    latitude: request.use_lat,
                    longtitude: request.use_long,
                    idTimViec365: request.use_id,
                    "inForPerson.account.birthday": request.use_birth_day,
                    "inForPerson.account.gender": request.use_gioi_tinh,
                    "inForPerson.account.married": request.use_hon_nhan,
                    "inForPerson.account.experience": request.cv_exp,
                    "inForPerson.account.education": request.cv_hocvan,
                    "inForPerson.candidate.use_type": request.use_type,
                    "inForPerson.candidate.user_reset_time": request.user_reset_time,
                    "inForPerson.candidate.use_view": request.use_view,
                    "inForPerson.candidate.use_noti": request.use_noti,
                    "inForPerson.candidate.use_show": request.use_show,
                    "inForPerson.candidate.use_show_cv": request.use_show_cv,
                    "inForPerson.candidate.use_active": request.use_active,
                    "inForPerson.candidate.use_td": request.use_td,
                    "inForPerson.candidate.use_check": request.use_check,
                    "inForPerson.candidate.point_time_active": request.point_time_active,
                    "inForPerson.candidate.cv_city_id": request.cv_city_id.split(",").map(Number),
                    "inForPerson.candidate.cv_cate_id": request.cv_cate_id.split(",").map(Number),
                    "inForPerson.candidate.cv_capbac_id": request.cv_capbac_id,
                    "inForPerson.candidate.cv_money_id": request.cv_money_id,
                    "inForPerson.candidate.cv_loaihinh_id": request.cv_loaihinh_id,
                    "inForPerson.candidate.cv_time": request.cv_time,
                    "inForPerson.candidate.cv_time_dl": request.cv_time_dl,
                    "inForPerson.candidate.cv_kynang": request.cv_kynang,
                    "inForPerson.candidate.um_type": request.um_type,
                    "inForPerson.candidate.um_min_value": request.um_min_value,
                    "inForPerson.candidate.um_max_value": request.um_max_value,
                    "inForPerson.candidate.um_unit": request.um_unit,
                    "inForPerson.candidate.cv_tc_name": request.cv_tc_name,
                    "inForPerson.candidate.cv_tc_cv": request.cv_tc_cv,
                    "inForPerson.candidate.cv_tc_dc": request.cv_tc_dc,
                    "inForPerson.candidate.cv_tc_phone": request.cv_tc_phone,
                    "inForPerson.candidate.cv_tc_email": request.cv_tc_email,
                    "inForPerson.candidate.cv_tc_company": request.cv_tc_company,
                    "inForPerson.candidate.cv_video": request.cv_video,
                    "inForPerson.candidate.cv_video_type": request.cv_video_type,
                    "inForPerson.candidate.cv_video_active": request.cv_video_active,
                }
            }
            await Users.updateOne({
                _id: user._id
            }, {
                $set: data
            });
            return fnc.success(res, "Thành công");
        } else {
            return fnc.setError(res, "Không tồn tại");
        }
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }

}

exports.addEmployee = async(req, res) => {
    try {
        const request = req.body;

        const idQLC = Number(request.ep_id);
        const user = await Users.findOne({
            idQLC: idQLC,
            type: { $ne: 1 }
        }).lean();

        if (user) {
            let data;

            if (user.inForPerson == null) {
                data = {
                    inForPerson: {
                        account: {
                            birthday: request.ep_birth_day,
                            gender: request.ep_gender,
                            married: request.ep_married,
                            experience: request.ep_exp,
                            education: request.ep_education,
                        },
                        employee: {
                            com_id: request.com_id,
                            dep_id: request.dep_id,
                            start_working_time: request.start_working_time,
                            position_id: request.position_id,
                            group_id: request.group_id,
                            time_quit_job: request.update_time,
                            ep_description: request.ep_description,
                            ep_featured_recognition: request.ep_featured_recognition,
                            ep_status: request.ep_status,
                            ep_signature: request.ep_signature,
                            allow_update_face: request.allow_update_face,
                            version_in_use: request.version_in_use
                        }
                    }
                }
            } else {
                data = {
                    "account.birthday": request.ep_birth_day,
                    "account.gender": request.ep_gender,
                    "account.married": request.ep_married,
                    "account.experience": request.ep_exp,
                    "account.education": request.education,
                    "employee.com_id": request.com_id,
                    "employee.dep_id": request.dep_id,
                    "employee.start_working_time": request.start_working_time,
                    "employee.position_id": request.position_id,
                    "employee.time_quit_job": request.time_quit_job,
                    "employee.ep_description": request.ep_description,
                    "employee.ep_featured_recognition": request.ep_featured_recognition,
                    "employee.ep_status": request.ep_status,
                    "employee.ep_signature": request.ep_signature,
                    "employee.allow_update_face": request.allow_update_face,
                    "employee.version_in_use": request.version_in_use,
                };
            }

            if (user.createdAt == 0) {
                data.createdAt = request.create_time;
            }

            await Users.updateOne({
                _id: user._id
            }, {
                $set: data
            });
            console.log("update thành công " + user._id)
            return fnc.success(res, "Thành công");
        } else {
            return fnc.setError(res, "Không tồn tại");
        }
    } catch (error) {
        return fnc.setError(res, error);
    }

}

exports.addCtyQlc = async(req, res) => {
    try {
        const request = req.body;

        const idChat = Number(request.chat365_id);
        let user;
        user = await Users.findOne({
            idQLC: request.com_id,
            type: 1
        });

        if (user) {
            let data;
            if (user.inForCompany == null) {
                data = {
                    idQLC: request.com_id,
                    inForCompany: {
                        cds: {
                            com_parent_id: request.com_parent_id,
                            type_timekeeping: request.type_timekeeping,
                            id_way_timekeeping: request.id_way_timekeeping,
                            com_role_id: request.com_role_id,
                            com_qr_logo: request.com_qr_logo,
                            enable_scan_qr: request.enable_scan_qr,
                            com_vip: request.com_vip,
                            com_ep_vip: request.com_ep_vip,
                            com_vip_time: request.com_quantity_time,
                            ep_crm: request.ep_crm,
                            ep_stt: request.com_kd
                        }
                    }
                }
            } else {
                data = {
                    idQLC: request.com_id,
                    "inForCompany.cds.com_parent_id": request.com_parent_id,
                    "inForCompany.cds.type_timekeeping": request.type_timekeeping,
                    "inForCompany.cds.id_way_timekeeping": request.id_way_timekeeping,
                    "inForCompany.cds.com_role_id": request.com_role_id,
                    "inForCompany.cds.com_qr_logo": request.com_qr_logo,
                    "inForCompany.cds.enable_scan_qr": request.enable_scan_qr,
                    "inForCompany.cds.com_vip": request.com_vip,
                    "inForCompany.cds.com_ep_vip": request.com_ep_vip,
                    "inForCompany.cds.com_vip_time": request.com_quantity_time,
                    "inForCompany.cds.ep_crm": request.ep_crm,
                    "inForCompany.cds.ep_stt": request.com_kd,
                }
            }
            await Users.updateOne({
                _id: user._id
            }, {
                $set: data
            });
            return fnc.success(res, "Thành công");
        } else {
            return fnc.setError(res, "Không tồn tại");
        }
    } catch (error) {
        return fnc.setError(res, error);
    }
}

exports.addProfile = async(req, res) => {
    try {
        const element = req.body;
        const item = new Profile({
            hs_id: element.hs_id,
            hs_use_id: element.hs_use_id,
            hs_name: element.hs_name,
            hs_link: element.hs_link,
            hs_cvid: element.hs_cvid,
            hs_create_time: element.hs_create_time,
            hs_active: element.hs_active,
            hs_link_hide: element.hs_link_hide,
            is_scan: element.is_scan,
            hs_link_error: element.hs_link_error,
            state: element.state,
            mdtd_state: element.mdtd_state,
            scan_cv: element.scan_cv,
        });
        await item.save();
        return fnc.success(res, "Thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
}

exports.addCvSaved = async(req, res) => {
    try {
        const element = req.body;
        const item = new SaveCvCandi({
            id: element.id,
            uid: element.uid,
            cvid: element.cvid,
            lang: element.lang,
            html: JSON.stringify(element.html),
            name_img: element.name_img,
            time_edit: element.time_edit,
            cv: element.cv,
            status: element.status,
            delete_cv: element.delete_cv,
            delete_time: element.delete_time,
            height_cv: element.height_cv,
            scan: element.scan,
            state: element.state,
        });
        await item.save();
        return fnc.success(res, "Thành công");
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error);
    }
}