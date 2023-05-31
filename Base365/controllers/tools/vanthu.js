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
    // const SettingDX = require('../../models/Vanthu/setting_dx')

// danh mục các loại đề xuất
exports.toolCateDeXuat = async(req, res, next) => {
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

exports.toolDeXuat = async(req, res, next) => {
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

exports.toolDeXuatXuLy = async(req, res, next) => {
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

exports.toolDeleteDX = async(req, res, next) => {
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
exports.toolGhiChu = async(req, res, next) => {
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

exports.toolGroupVanBan = async(req, res, next) => {
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

exports.toolhideCateDX = async(req, res, next) => {
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

exports.toolHistoryHDX = async(req, res, next) => {
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

exports.toolLyDo = async(req, res, next) => {
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

exports.toolPhongBan = async(req, res, next) => {
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

exports.toolSettingDX = async(req, res, next) => {
    try {
        do {
            let page = 1;
            let result = true;
            let listItems = await fnc.getDataAxios('https://vanthu.timviec365.vn/api/select_tbl_setting_dx.php', { page: page, pb: 0 });
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let timeLimit = null;
                    let timeLimitl = null;
                    let timeTp = null;
                    let timeHh = null;
                    let timeCreated = null;
                    let updateTime = null;
                    if (data[i].time_limit != 0) {
                        timeLimit = new Date(data[i].time_limit * 1000)
                    }
                    if (data[i].time_tp != 0) {
                        timeTp = new Date(data[i].time_tp * 1000)
                    }
                    if (data[i].time_hh != 0) {
                        timeHh = new Date(data[i].time_hh * 1000)
                    }
                    if (data[i].time_created != 0) {
                        timeCreated = new Date(data[i].time_created * 1000)
                    }
                    if (data[i].update_time != 0) {
                        updateTime = new Date(data[i].update_time * 1000)
                    }
                    let post = await fnc.getDatafindOne(SettingDX, { id_setting: data[i].id_setting })
                    if (post == null) {
                        let newSDX = new SettingDX({
                            id_setting: data[i].id_setting,
                            com_id: data[i].com_id,
                            type_setting: data[i].type_setting,
                            type_browse: data[i].type_browse,
                            time_limit: new Date(data[i].time_limit * 1000),
                            shift_id: data[i].shift_id,
                            time_limit_l: data[i].time_limit_l,
                            list_user: data[i].list_user,
                            time_tp: new Date(data[i].time_tp * 1000),
                            time_hh: new Date(data[i].time_hh * 1000),
                            time_created: new Date(data[i].time_created * 1000),
                            update_time: new Date(data[i].update_time * 1000)
                        });
                        await newSDX.save();
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