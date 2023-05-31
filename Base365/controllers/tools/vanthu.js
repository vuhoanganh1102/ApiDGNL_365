const fnc = require('../../services/functions');
const FormData = require('form-data');
const axios = require('axios');
const CateDeXuat = require('../../models/Vanthu/cate_de_xuat');
const DeXuat = require('../../models/Vanthu/de_xuat');
const DeXuatXuLy = require('../../models/Vanthu/de_xuat_xu_ly');
const DeleteDeXuat = require('../../models/Vanthu/delete_dx');
const GhiChu = require('../../models/Vanthu/ghi_chu')
const GroupVanBan = require('../../models/Vanthu/group_van_ban');
const HideCateDX = require('../../models/Vanthu/hide_cate_dx');
const HistoryHDX = require('../../models/Vanthu/history_handling_dx');
const LyDo = require('../../models/Vanthu/ly_do');
const PhongBan = require('../../models/Vanthu/phong_ban')
//const SettingDX = require('../../models/Vanthu365/setting_dx')
const setingDx = require('../../models/Vanthu365/setting_dx');
//const fnc = require('../../services/functions.js');
const tbl_feedback = require('../../models/Vanthu365/tbl_feedback');
const qlcv_edit = require('../../models/Vanthu365/tbl_qlcv_edit');
const qlcv_role = require('../../models/Vanthu365/tbl_qlcv_role');
const congVan = require('../../models/Vanthu365/tbl_qly_congvan');
const VBThayTHe = require('../../models/Vanthu365/tbl_thay_the');
const View = require('../../models/Vanthu365/tbl_view');
const TextBook = require('../../models/Vanthu365/tbl_textBook');
const TLLuuTru = require('../../models/Vanthu365/tl_luu_tru');
const ThongBao = require('../../models/Vanthu365/tl_thong_bao');
const NguoiDuyetVanBan = require('../../models/Vanthu365/user_duyet_vb');
const UserModel = require('../../models/Vanthu365/user_model');
const VanBan = require('../../models/Vanthu365/van_ban');

// danh mục các loại đề xuất
exports.toolCateDeXuat = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);

            const response = await axios.post('https://vanthu.timviec365.vn/api/select_tbl_cate_de_xuat.php', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            let data = response.data.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const cate = new CateDeXuat({
                        id_cate_dx: data[i].id_cate_dx,
                        cate_dx: data[i].cate_dx,
                        name_cate_dx: data[i].name_cate_dx,
                        com_id: data[i].com_id,
                        mieuta_maudon: data[i].mieuta_maudon,
                        date_cate_dx: data[i].date_cate_dx,
                        money_cate_dx: data[i].money_cate_dx,
                        hieu_luc_cate: data[i].hieu_luc_cate,
                        kieu_duyet_cate: data[i].kieu_duyet_cate,
                        user_duyet_cate: data[i].user_duyet_cate,
                        ghi_chu_cate: data[i].ghi_chu_cate,
                        created_date: data[i].created_date,
                        update_time: data[i].update_time,
                        time_limit: data[i].time_limit,
                        time_limit_l: data[i].time_limit_l,
                        trang_thai_dx: data[i].trang_thai_dx
                    });
                    await CateDeXuat.create(cate);
                }
                page++;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

//exports.toolDeXuat = async (req, res, next) => {
exports.toolDeXuat = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_de_xuat.php', { page: page, pb: 0 })
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let timeCreate = null;
                    let receptionTime = null;
                    let browsingTime = null;

                    if (data[i].time_create != 0) {
                        timeCreate = new Date(data[i].time_create * 1000)
                    }
                    if (data[i].time_tiep_nhan != 0) {
                        receptionTime = new Date(data[i].time_tiep_nhan * 1000)
                    }
                    if (data[i].time_duyet != 0) {
                        browsingTime = new Date(data[i].time_duyet * 1000)
                    }

                    let post = await fnc.getDatafindOne(DeXuat, { id_de_xuat: data[i].id_de_xuat });
                    if (post == null) {
                        let newDX = new DeXuat({
                            id_de_xuat: data[i].id_de_xuat,
                            name_dx: data[i].name_dx,
                            type_dx: data[i].type_dx,
                            noi_dung: data[i].noi_dung,
                            name_user: data[i].name_user,
                            id_user: data[i].id_user,
                            com_id: data[i].com_id,
                            kieu_duyet: data[i].kieu_duyet,
                            id_user_duyet: data[i].id_user_duyet,
                            id_user_theo_doi: data[i].id_user_theo_doi,
                            file_kem: data[i].file_kem,
                            type_duyet: data[i].type_duyet,
                            type_time: data[i].type_time,
                            time_start_out: data[i].time_start_out,
                            time_create: new Date(data[i].time_create * 1000),
                            time_tiep_nhan: new Date(data[i].time_tiep_nhan * 1000),
                            time_duyet: new Date(data[i].time_duyet * 1000),
                            active: data[i].active,
                            del_type: data[i].del_type
                        });
                        await newDX.save();
                    }
                }
                page += 1;
                console.log(page)
            } else result = false;
        } while (result)
        await fnc.success(res, 'thanh cong')
    } catch (err) {
        console.log(err);
        return fnc.setError(res, err)

    }
}

exports.toolDeXuatXuLy = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;

        do {
            let listItems = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_de_xuat_xu_ly.php', { page: page, pb: 0 })
            let data = listItems.data.items;

            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let post = await fnc.getDatafindOne(DeXuatXuLy, { id_dx: data[i].new_id })
                    if (post == null) {
                        let newDXXL = new DeXuatXuLy({
                            id_dx: data[i].id_dx,
                            id_vb: data[i].id_vb,
                            user_xu_ly: data[i].user_xu_ly,
                            y_kien_xu_ly: data[i].y_kien_xu_ly,
                            ghi_chu: data[i].ghi_chu
                        });
                        await newDXXL.save();
                    }
                }
                page += 1;
                console.log(page)
            } else result = false;

        } while (result);
        await fnc.success(res, 'thanh cong')
    } catch (err) {
        console.log(err)
        return fnc.setError(res, err)
    }
}

exports.toolDeleteDX = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_delete_dx.php', { page: page, pb: 0 });
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let timeDelete = null;
                    if (data[i].time_del != 0) {
                        timeDelete = new Date(data[i].time_del * 1000)
                    }
                    let post = await fnc.getDatafindOne(DeleteDeXuat, { id_del: data[i].id_del })
                    if (post == null) {
                        let newDDX = new DeleteDeXuat({
                            id_del: data[i].id_del,
                            user_del: data[i].user_del,
                            user_del_com: data[i].user_del_com,
                            id_dx_del: data[i].id_dx_del,
                            time_del: new Date(data[i].time_del * 1000)
                        });
                        await newDDX.save();
                    }
                }
                page += 1;
                console.log(page)
            } else result = false;
        } while (result);
        await fnc.success(res, 'thanh cong')
    } catch (err) {
        console.log(err)
        return fnc.setError(res, err)
    }
}
exports.toolGhiChu = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_ghi_chu.php', { page: page, pb: 0 });
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let post = await fnc.getDatafindOne(GhiChu, { id_note: data[i].id_note })
                    if (post == null) {
                        let newGC = new GhiChu({
                            id_note: data[i].id_note,
                            id_vb: data[i].id_vb,
                            text_note: data[i].text_note

                        });
                        await newGC.save();
                    }
                }
                page += 1;
                console.log(page)
            } else result = false;
        } while (result);
        await fnc.success(res, 'thanh cong')
    } catch (err) {
        console.log(err)
        return fnc.setError(res, err)
    }
}

exports.toolGroupVanBan = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_group_van_ban.php', { page: page, pb: 0 });
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let post = await fnc.getDatafindOne(GroupVanBan, { id_group_vb: data[i].id_group_vb })
                    if (post == null) {
                        let newGVB = new GroupVanBan({
                            id_group_vb: data[i].id_group_vb,
                            name_group: data[i].name_group,
                            admin_group: data[i].admin_group,
                            user_view: data[i].user_view,
                            book_vb: data[i].book_vb,
                            com_id: data[i].com_id
                        });
                        await newGVB.save();
                    }
                }
                page += 1;
                console.log(page)
            } else result = false;
        } while (result)
        await fnc.success(res, 'thanh cong')
    } catch (err) {
        console.log(err)
        return fnc.setError(res, err)
    }
}


exports.toolhideCateDX = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_hide_cate_dx.php', { page: page, pb: 0 });
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let post = await fnc.getDatafindOne(HideCateDX, { id_hide: data[i].id_hide })
                    if (post == null) {
                        let newCDX = new HideCateDX({
                            id_hide: data[i].id_hide,
                            id_com: data[i].id_com,
                            id_cate_dx: data[i].id_cate_dx,
                        });
                        await newCDX.save();
                    }
                }
                page += 1;
                console.log(page)
            } else result = false;
        } while (result)
        await fnc.success(res, 'thanh cong')
    } catch (err) {
        console.log(err)
        return fnc.setError(res, err)
    }
}

exports.toolHistoryHDX = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_history_handling_dx.php', { page: page, pb: 0 });
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let Time = null;
                    if (data[i].time != 0) {
                        Time = new Date(data[i].time * 1000)
                    }
                    let post = await fnc.getDatafindOne(HistoryHDX, { id_his: data[i].id_his })
                    if (post == null) {
                        let newHHDX = new HistoryHDX({
                            id_his: data[i].id_his,
                            id_dx: data[i].id_dx,
                            id_user: data[i].id_user,
                            type_handling: data[i].id_user,
                            time: new Date(data[i].time * 1000)

                        });
                        await newHHDX.save();
                    }
                }
                page += 1;
                console.log(page)
            } else result = false;
        } while (result)
        await fnc.success(res, 'thanh cong')
    } catch (err) {
        console.log(err)
        return fnc.setError(res, err)
    }
}

exports.toolLyDo = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_ly_do.php', { page: page, pb: 0 });
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let timeCreated = null;
                    if (data[i].time_created != 0) {
                        timeCreated = new Date(data[i].time_created * 1000)
                    }
                    let post = await fnc.getDatafindOne(LyDo, { id_ld: data[i].id_ld })
                    if (post == null) {
                        let newLD = new LyDo({
                            id_ld: data[i].id_ld,
                            type_ld: data[i].type_ld,
                            nd_ld: data[i].nd_ld,
                            id_dx: data[i].id_dx,
                            time_created: new Date(data[i].time_created * 1000)
                        });
                        await newLD.save();
                    }
                }
                page += 1;
                console.log(page)
            } else result = false;

        } while (result)
        await fnc.success(res, 'thanh cong')
    } catch (err) {
        console.log(err)
        return fnc.setError(res, err)
    }
}

exports.toolPhongBan = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_phong_ban.php', { page: page, pb: 0 });
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let createDate = null;
                    if (data[i].create_date_phongban != 0) {
                        createDate = new Date(data[i].create_date_phongban * 1000)
                    }
                    let post = await fnc.getDatafindOne(PhongBan, { id_phongban: data[i].id_phongban })
                    if (post == null) {
                        let newPB = new PhongBan({
                            id_phongban: data[i].id_phongban,
                            ten_phongban: data[i].ten_phongban,
                            thanh_vien: data[i].thanh_vien,
                            create_date_phongban: new Date(data[i].create_date_phongban * 1000)

                        });
                        await newPB.save();
                    }
                }
                page += 1;
                console.log(page)
            } else result = false;
        } while (result)
        await fnc.success(res, 'thanh cong')

    } catch (err) {
        console.log(err)
        return fnc.setError(res, err)
    }

}

// exports.toolSettingDX = async (req, res, next) => {
//     try {
//         do {
//             let page = 1;
//             let result = true;
//             let listItems = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_setting_dx.php', { page: page });
//             let data = listItems.data.items;
//             if (data.length > 0) {
//                 for (let i = 0; i < data.length; i++) {
//                     let timeLimit = null;
//                     let timeLimitl = null;
//                     let timeTp = null;
//                     let timeHh = null;
//                     let timeCreated = null;
//                     let updateTime = null;
//                     if (data[i].time_limit != 0) {
//                         timeLimit = new Date(data[i].time_limit * 1000)
//                     }
//                     if (data[i].time_tp != 0) {
//                         timeTp = new Date(data[i].time_tp * 1000)
//                     }
//                     if (data[i].time_hh != 0) {
//                         timeHh = new Date(data[i].time_hh * 1000)
//                     }
//                     if (data[i].time_created != 0) {
//                         timeCreated = new Date(data[i].time_created * 1000)
//                     }
//                     if (data[i].update_time != 0) {
//                         updateTime = new Date(data[i].update_time * 1000)
//                     }
//                     let post = await fnc.getDatafindOne(SettingDX, { id_setting: data[i].id_setting })
//                     if (post == null) {
//                         let newSDX = new SettingDX({
//                             id_setting: data[i].id_setting,
//                             com_id: data[i].com_id,
//                             type_setting: data[i].type_setting,
//                             type_browse: data[i].type_browse,
//                             time_limit: new Date(data[i].time_limit * 1000),
//                             shift_id: data[i].shift_id,
//                             time_limit_l: data[i].time_limit_l,
//                             list_user: data[i].list_user,
//                             time_tp: new Date(data[i].time_tp * 1000),
//                             time_hh: new Date(data[i].time_hh * 1000),
//                             time_created: new Date(data[i].time_created * 1000),
//                             update_time: new Date(data[i].update_time * 1000)
//                         });
//                         await newSDX.save();
//                     }
//                 }
//                 page += 1;
//                 console.log(page)
//             }
//             else result = false;
//         } while (result)
//         await fnc.success(res, 'thanh cong')
//     } catch (err) {
//         console.log(err)
//         return fnc.setError(res, err)
//     }
// }



exports.toolSettingDx = async (req, res, next) => {
    try {
        let result = true;
        page = 1;
        do {
            let data = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_setting_dx.php', { page: page, pb: 1 });
            let listSetting = data.data.items;
            if (listSetting.length > 0) {
                for (let i = 0; i < listSetting.length; i++) {
                    const SettingDx = new setingDx({
                        idSetting: listSetting[i].id_setting,
                        ComId: listSetting[i].com_id,
                        typeSetting: listSetting[i].type_setting,
                        typeBrowse: listSetting[i].type_browse,
                        timeLimit: listSetting[i].time_limit,
                        shiftId: listSetting[i].shift_id,
                        timeLimitL: listSetting[i].time_limit_l,
                        listUser: listSetting[i].list_user,
                        timeTP: listSetting[i].time_tp,
                        timeHH: listSetting[i].time_hh,
                        timeCreate: listSetting[i].time_created,
                        updateTime: listSetting[i].update_time,
                    })
                    await SettingDx.save();
                }
                page++;
                console.log(page);

            } else { result = false; }

        } while (result);
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

exports.tooltblFeedback = async (req, res, next) => {
    try {
        let result = true;
        page = 1;
        do {
            let data = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_tbl_feedback.php', { page: page, pb: 1 });
            let listSetting = data.data.items;
            if (listSetting.length > 0) {
                for (let i = 0; i < listSetting.length; i++) {
                    const tblFeedback = new tbl_feedback({
                        fbID: listSetting[i].fb_id,
                        userFb: listSetting[i].user_fb,
                        vb_fb: listSetting[i].vb_fb,
                        nameUser: listSetting[i].name_user,
                        ndFeedback: listSetting[i].nd_fb,
                        createTime: (listSetting[i].created_time),

                    })
                    await tblFeedback.save();
                }
                page++;
                console.log(page);

            } else { result = false; }

        } while (result);
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

exports.tool_qlcv_edit = async (req, res, next) => {
    try {
        let result = true;
        page = 1;
        do {
            let data = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_tbl_qlcv_edit.php', { page: page, pb: 1 });
            let listData = data.data.items;
            if (listData.length > 0) {
                for (let i = 0; i < listData.length; i++) {
                    const qlcvEdit = new qlcv_edit({
                        ed_id: listData[i].ed_id,
                        ed_cv_id: listData[i].ed_cv_id,
                        ed_time: listData[i].ed_time,
                        ed_type_user: listData[i].ed_type_user,
                        edUser: listData[i].ed_user,
                        ed_nd: listData[i].ed_nd,
                        ed_usc_id: listData[i].ed_usc_id

                    })
                    await qlcvEdit.save();
                }
                page++;
                console.log(page);

            } else { result = false; }

        } while (result);
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

exports.tool_qlcv_role = async (req, res, next) => {
    try {
        let result = true;
        page = 1;
        do {
            let data = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_tbl_qlcv_role.php', { page: page, pb: 1 });
            let listData = data.data.items;
            if (listData.length > 0) {
                for (let i = 0; i < listData.length; i++) {
                    const qlcvRole = new qlcv_role({
                        ro_id: listData[i].ro_id,
                        ro_user_id: listData[i].ro_use_id,
                        ro_usc_id: listData[i].ro_usc_id,
                        ro_list_vb: listData[i].ro_list_vb,
                        ro_list_hd: listData[i].ro_list_hd,
                        ro_seach_vb: listData[i].ro_search_vb,
                        ro_lsu_vb: listData[i].ro_lsu_vb,
                        ro_thongke_vb: listData[i].ro_thongke_vb,
                        ro_dele_vb: listData[i].ro_dele_vb,


                    })
                    await qlcvRole.save();
                }
                page++;
                // console.log(page);

            } else { result = false; }

        } while (result);
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

exports.tool_qlcv_congVan = async (req, res, next) => {
    try {
        let result = true;
        page = 1;
        do {
            let data = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_tbl_qly_congvan.php', { page: page, pb: 1 });
            let listData = data.data.items;
            if (listData.length > 0) {
                for (let i = 0; i < listData.length; i++) {
                    const qlCongVan = new congVan({
                        cv_id: listData[i].cv_id,
                        cv_id_vb: listData[i].cv_id_vb,
                        cv_id_book: listData[i].cv_id_book,
                        cv_name: listData[i].cv_name,
                        cv_kieu: listData[i].cv_kieu,
                        cv_so: listData[i].cv_so,
                        cv_type_soan: listData[i].cv_type_soan,
                        cv_soan_ngoai: listData[i].cv_soan_ngoai,
                        cv_phong_soan: listData[i].cv_phong_soan,
                        cv_user_soan: listData[i].cv_user_soan,
                        cv_name_soan: listData[i].cv_name_soan,
                        cv_date: listData[i].cv_date,
                        cv_user_save: listData[i].cv_user_save,
                        cv_user_ky: listData[i].cv_user_ky,
                        cv_type_nhan: listData[i].cv_type_nhan,
                        cv_nhan_noibo: listData[i].cv_nhan_noibo,
                        cv_nhan_ngoai: listData[i].cv_nhan_ngoai,
                        cv_type_chuyenden: listData[i].cv_type_chuyenden,
                        cv_chuyen_noibo: listData[i].cv_chuyen_noibo,
                        cv_chuyen_ngoai: listData[i].cv_chuyen_ngoai,
                        cv_trich_yeu: listData[i].cv_trich_yeu,
                        cv_ghi_chu: listData[i].cv_ghi_chu,
                        cv_file: listData[i].cv_file,
                        cv_type_xoa: listData[i].cv_type_xoa,
                        cv_type_user_xoa: listData[i].cv_type_user_xoa,
                        cv_user_xoa: listData[i].cv_user_xoa,
                        cv_time_xoa: listData[i].cv_time_xoa,
                        cv_type_loai: listData[i].cv_type_loai,
                        cv_usc_id: listData[i].cv_usc_id,
                        cv_time_created: listData[i].cv_time_created,
                        cv_time: listData[i].cv_time,
                        cv_type_kp: listData[i].cv_type_kp,
                        cv_type_user_kp: listData[i].cv_type_user_kp,
                        cv_user_kp: listData[i].cv_user_kp,
                        cv_time_kp: listData[i].cv_time_kp,
                        cv_type_edit: listData[i].cv_type_edit,
                        cv_time_edit: listData[i].cv_time_edit,
                        cv_type_hd: listData[i].cv_type_hd,
                        cv_status_hd: listData[i].cv_status_hd,
                        cv_money: listData[i].cv_money,

                    });
                    await qlCongVan.save();
                }
                page++;
                console.log(page);

            } else { result = false; }

        } while (result);
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}


exports.tool_VanBanThayThe = async (req, res, next) => {
    try {
        let result = true;
        page = 1;
        do {
            let data = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_tbl_thay_the.php', { page: page, pb: 1 });
            let listData = data.data.items;
            if (listData.length > 0) {
                for (let i = 0; i < listData.length; i++) {
                    const vbThayThe = new VBThayTHe({
                        id_tt: listData[i].id_tt,
                        id_vb_tt: listData[i].id_vb_tt,
                        so_vb_tt: listData[i].so_vb_tt,
                        ten_vb_tt: listData[i].ten_vb_tt,
                        trich_yeu_tt: listData[i].trich_yeu_tt,
                        create_time: listData[i].create_time,
                    });
                    await vbThayThe.save();
                }
                page++;
                console.log(page);

            } else { result = false; }

        } while (result);
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

exports.tool_View = async (req, res, next) => {
    try {
        let result = true;
        page = 1;
        do {
            let data = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_tbl_view.php', { page: page, pb: 1 });
            let listData = data.data.items;
            if (listData.length > 0) {
                for (let i = 0; i < listData.length; i++) {
                    const view = new View({
                        id_view: listData[i].id_view,
                        id_user: listData[i].id_user,
                        id_vb: listData[i].id_vb,
                        time: listData[i].time,
                    });
                    await view.save();
                }
                page++;
                console.log(page);

            } else { result = false; }

        } while (result);
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}


exports.tool_textBook = async (req, res, next) => {
    try {
        let result = true;
        page = 1;
        do {
            let data = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_text_book.php', { page: page, pb: 1 });
            let listData = data.data.items;
            if (listData.length > 0) {
                for (let i = 0; i < listData.length; i++) {
                    const textBook = new TextBook({
                        id_book: listData[i].id_book,
                        name_book: listData[i].name_book,
                        nguoi_tao: listData[i].nguoi_tao,
                        com_id: listData[i].com_id,
                        year: listData[i].year,
                        check_year: listData[i].check_year,
                        creat_date: listData[i].create_date,
                    });
                    await textBook.save();
                }
                page++;
                console.log(page);

            } else { result = false; }

        } while (result);
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

exports.tool_tlLuuTru = async (req, res, next) => {
    try {
        let result = true;
        page = 1;
        do {
            let data = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_tl_luu_tru.php', { page: page, pb: 1 });
            let listData = data.data.items;
            if (listData.length > 0) {
                for (let i = 0; i < listData.length; i++) {
                    const tlLuuTru = new TLLuuTru({
                        id_tl: listData[i].id_tl,
                        ten_tl: listData[i].ten_tl,
                        nd_tl: listData[i].nd_tl,
                        file_tl: listData[i].file_tl,
                        nguoi_tao_tai_lieu: listData[i].nguoi_tai_tai_lieu,
                        id_nhom_vb: listData[i].id_nhom_vb,
                        id_van_ban: listData[i].id_van_ban,
                        id_nguoi_xem: listData[i].id_ng_xem,
                        id_nguoi_tai: listData[i].id_ng_tai,
                        thoigian_tai: listData[i].thoigian_tai,
                    });
                    await tlLuuTru.save();
                }
                page++;
                console.log(page);

            } else { result = false; }

        } while (result);
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

exports.tool_ThongBao = async (req, res, next) => {
    try {
        let result = true;
        page = 1;
        do {
            let data = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_tl_thongbao.php', { page: page, pb: 1 });
            let listData = data.data.items;
            if (listData.length > 0) {
                for (let i = 0; i < listData.length; i++) {
                    const thongBao = new ThongBao({
                        id_thong_bao: listData[i].id_thong_bao,
                        id_user: listData[i].id_user,
                        id_user_nhan: listData[i].id_user_nhan,
                        id_van_ban: listData[i].id_van_ban,
                        type: listData[i].type,
                        view: listData[i].view,
                        created_date: listData[i].created_date,
                    });
                    await thongBao.save();
                }
                page++;
                console.log(page);

            } else { result = false; }

        } while (result);
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}


exports.tool_NguoiDuyetVB = async (req, res, next) => {
    try {
        let result = true;
        page = 1;
        do {
            let data = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_user_duyet_vb.php', { page: page, pb: 1 });
            let listData = data.data.items;
            if (listData.length > 0) {
                for (let i = 0; i < listData.length; i++) {
                    const nguoiDuyetVanBan = new NguoiDuyetVanBan({
                        id_duyet: listData[i].id_duyet,
                        id_vb_duyet: listData[i].id_vb_duyet,
                        id_user_duyet: listData[i].id_user_duyet,
                        time_duyet: listData[i].time_duyet,
                    });
                    await nguoiDuyetVanBan.save();
                }
                page++;
                console.log(page);

            } else { result = false; }

        } while (result);
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

exports.tool_userModel = async (req, res, next) => {
    try {
        let result = true;
        page = 1;
        do {
            let data = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_user_model.php', { page: page, pb: 1 });
            let listData = data.data.items;
            if (listData.length > 0) {
                for (let i = 0; i < listData.length; i++) {
                    const userModel = new UserModel({
                        id: listData[i].id,
                        id_user: listData[i].id_user,
                        type_cong_ty: listData[i].type_cong_ty,
                        type_ngoai: listData[i].type_ngoai,
                        duyet_pb: listData[i].duyet_pb,
                        duyet_tung_pb: listData[i].duyet_tung_pb,
                        create_time: listData[i].created_time,
                    });
                    await userModel.save();
                }
                page++;
                console.log(page);

            } else { result = false; }

        } while (result);
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

exports.tool_VanBan = async (req, res, next) => {
    try {
        let result = true;
        page = 1;
        do {
            let data = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_van_ban.php', { page: page });
            let listData = data.data.items;
            if (listData.length > 0) {

                for (let i = 0; i < listData.length; i++) {



                    // console.log(typeof (listData[i].thoi_gian_duyet));
                    // let thoiGianDuyet = null;
                    if (listData[i].id == 49) {
                        console.log((listData[i].thoi_gian_duyet));

                    };

                    const vanBan = new VanBan({
                        id: listData[i].id,
                        title_vb: listData[i].title_vb,
                        des_vb: listData[i].des_vb,
                        so_vb: listData[i].so_vb,
                        nd_vb: listData[i].nd_vb,
                        book_vb: listData[i].book_vb,
                        time_ban_hanh: (listData[i].time_ban_hanh * 1000) > 0 ? listData[i].thoi_gian_duyet * 1000 : null,
                        time_hieu_luc: (listData[i].time_hieu_luc * 1000) > 0 ? listData[i].thoi_gian_duyet * 1000 : null,
                        nhom_vb: listData[i].nhom_vb,
                        user_send: listData[i].user_send,
                        name_user_send: listData[i].name_user_send,
                        com_user: listData[i].com_user,
                        user_nhan: listData[i].user_nhan,
                        user_cty: listData[i].user_cty,
                        user_forward: listData[i].user_forward,
                        type_thu_hoi: listData[i].type_thu_hoi,
                        gui_ngoai_cty: listData[i].gui_ngoai_cty,
                        mail_cty: listData[i].mail_cty,
                        name_com: listData[i].name_com,
                        file_vb: listData[i].file_vb,
                        trang_thai_vb: listData[i].trang_thai_vb,
                        duyet_vb: listData[i].duyet_vb,
                        type_xet_duyet: listData[i].type_xet_duyet,
                        thoi_gian_duyet: (listData[i].thoi_gian_duyet * 1000) > 0 ? listData[i].thoi_gian_duyet * 1000 : null,
                        nguoi_xet_duyet: listData[i].nguoi_xet_duyet,
                        nguoi_theo_doi: listData[i].nguoi_theo_doi,
                        nguoi_ky: listData[i].nguoi_ky,
                        so_van_ban: listData[i].so_van_ban,
                        phieu_trinh: listData[i].phieu_trinh,
                        chuc_vu_nguoi_ky: listData[i].chuc_vu_nguoi_ky,
                        ghi_chu: listData[i].ghi_chu,
                        type_khan_cap: listData[i].type_khan_cap,
                        type_bao_mat: listData[i].type_bao_mat,
                        type_tai: listData[i].type_tai,
                        type_duyet_chuyen_tiep: listData[i].type_duyet_chuyen_tiep,
                        type_nhan_chuyen_tiep: listData[i].type_nhan_chuyen_tiep,
                        type_thay_the: listData[i].type_thay_the,
                        created_date: new Date(listData[i].created_date * 1000),
                        type_duyet: listData[i].type_duyet,
                        update_time: listData[i].update_time,
                    });
                    await vanBan.save();

                }
                page++;
                console.log(page);

            } else { result = false; }

        } while (result);
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

