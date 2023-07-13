let BaoDuong = require('../../models/QuanLyTaiSan/BaoDuong');
const fnc = require('../../services/functions');
const axios = require('axios');
const vi_tri_ts = require('../../models/QuanLyTaiSan/ViTri_ts')
const ThuHoiTaiSan = require('../../models/QuanLyTaiSan/ThuHoi')
const ThongTinTuyChinh = require('../../models/QuanLyTaiSan/ThongTinTuyChinh')
const ThongBao = require('../../models/QuanLyTaiSan/ThongBao')
const TheoDoiCongSuat = require('../../models/QuanLyTaiSan/TheoDoiCongSuat')
const ThanhLy = require('../../models/QuanLyTaiSan/ThanhLy')
const TaiSanDangSuDung = require('../../models/QuanLyTaiSan/TaiSanDangSuDung')
const TaiSanDaiDienNhan = require('../../models/QuanLyTaiSan/TaiSanDaiDienNhan')
const CapPhat = require('../../models/QuanLyTaiSan/CapPhat');
const SuaChua = require("../../models/QuanLyTaiSan/Sua_chua");
const TaiSan = require("../../models/QuanLyTaiSan/TaiSan");
const QuanTrinhSuDung = require("../../models/QuanLyTaiSan/QuaTrinhSuDung");
const TaiSanDangSD = require("../../models/QuanLyTaiSan/TaiSanDangSuDung");







// ghi chú: pb

// 1: bao_duong
// 2: bao_hanh
// 3: cap_phat
// 4: danhsach_capphat
// 5: dieu_chuyen
// 6: donvi_cs
// 7: ghi_tang_ts
// 8: huy
// 9: khau_hao
// 10: kiem_ke
// 11: loai_taisan
// 12: mat
// 13: nhac_nho
// 14: nhom_taisan
// 15: phan_bo
// 16: phan_quyen
// 17: quatrinh_sudung
// 18: quydinh_bd
// 19: sua_chua
// 20: taisan
// 21: taisan_vitri
// 22: tai_san_dai_dien_nhan
// 23: tai_san_dang_sd
// 24: tep_dinhkem
// 25: thanh_ly
// 26: theodoi_congsuat
// 27: thongbao
// 28: thong_tin_tuy_chinh
// 29: thu_hoi
// 30: vi_tri_ts


//Lam 
exports.toolBaoDuong = async (req, res, next) => {
    try {
        let result = true;
        page = 1;
        do {
            let data = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb: 1 });
            let listData = data.data.items;
            if (listData.length > 0) {
                for (let i = 0; i < listData.length; i++) {
                    const save = new BaoDuong({
                        id_bd: listData[i].id_bd,
                        baoduong_taisan: listData[i].baoduong_taisan,
                        bd_sl: listData[i].bd_sl,
                        id_cty: listData[i].id_cty,
                        bd_tai_congsuat: listData[i].bd_tai_congsuat,
                        bd_cs_dukien: listData[i].bd_cs_dukien,
                        bd_gannhat: listData[i].bd_gannhat,
                        bd_trang_thai: listData[i].bd_trang_thai,
                        bd_ngay_batdau: listData[i].bd_ngay_batdau,
                        bd_dukien_ht: listData[i].bd_dukien_ht,
                        bd_ngay_ht: listData[i].bd_ngay_ht,
                        bd_noi_dung: listData[i].bd_noi_dung,
                        bd_chiphi_dukien: listData[i].bd_chiphi_dukien,
                        bd_chiphi_thucte: listData[i].bd_chiphi_thucte,
                        bd_ng_thuchien: listData[i].bd_ng_thuchien,
                        donvi_bd: listData[i].donvi_bd,
                        dia_diem_bd: listData[i].dia_diem_bd,
                        diachi_nha_cc: listData[i].diachi_nha_cc,
                        bd_ngay_sudung: listData[i].bd_ngay_sudung,
                        bd_type_quyen: listData[i].bd_type_quyen,
                        bd_id_ng_xoa: listData[i].bd_id_ng_xoa,
                        bd_id_ng_tao: listData[i].bd_id_ng_tao,
                        bd_ng_sd: listData[i].bd_ng_sd,
                        bd_type_quyen_sd: listData[i].bd_type_quyen_sd,
                        bd_vi_tri_dang_sd: listData[i].bd_vi_tri_dang_sd,
                        xoa_bd: listData[i].xoa_bd,
                        bd_date_create: listData[i].bd_date_create,
                        bd_date_delete: listData[i].bd_date_delete,
                        lydo_tu_choi: listData[i].lydo_tu_choi,
                        bd_type_quyen_xoa: listData[i].bd_type_quyen_xoa,
                    });
                    await save.save();
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

//Trung
exports.toolViTriTaiSan = async (req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb: 30 })
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const html = JSON.stringify(element.html);
                    // let updateAt = element.update_time;
                    // if (updateAt == 0) {
                    //     updateAt = null;
                    // };
                    const vi_tri = new vi_tri_ts({
                        _id: element.id_vitri,
                        id_cty: element.id_cty,
                        vi_tri: element.vi_tri,
                        dv_quan_ly: element.dv_quan_ly,
                        quyen_dv_qly: element.quyen_dv_qly,
                        ghi_chu_vitri: element.ghi_chu_vitri,
                    })
                    await vi_tri.save()

                }
                page++;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}
exports.toolThongTinTuyChinh = async (req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb: 28 })
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const html = JSON.stringify(element.html);
                    // let updateAt = element.update_time;
                    // if (updateAt == 0) {
                    //     updateAt = null;
                    // };
                    const info = new ThongTinTuyChinh({
                        _id: element.id_tt,
                        com_id_tt: element.com_id_tt,
                        id_nhom_ts: element.id_nhom_ts,
                        tt_ten_truong: element.tt_ten_truong,
                        kieu_du_lieu: element.kieu_du_lieu,
                        noidung_mota: element.noidung_mota,
                        ng_tao: element.ng_tao,
                        type_quyen_tao: element.type_quyen_tao,
                        tt_date_create: element.tt_date_create,
                        tt_xoa: element.tt_xoa,
                        ng_xoa: element.ng_xoa,
                        ngay_xoa: element.ngay_xoa,
                        type_quyen_xoa: element.type_quyen_xoa,
                    })
                    await info.save()

                }
                page++;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}
exports.toolThuHoiTaiSan = async (req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb: 29 })
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const html = JSON.stringify(element.html);
                    // let updateAt = element.update_time;
                    // if (updateAt == 0) {
                    //     updateAt = null;
                    // };
                    const ThuHoi = new ThuHoiTaiSan({
                        _id: element.thuhoi_id,
                        thuhoi_ng_tao: element.thuhoi_ng_tao,
                        th_type_quyen: element.th_type_quyen,
                        thuhoi_taisan: element.thuhoi_taisan,
                        id_cty: element.id_cty,
                        id_ng_thuhoi: element.id_ng_thuhoi,
                        id_ng_dc_thuhoi: element.id_ng_dc_thuhoi,
                        id_pb_thuhoi: element.id_pb_thuhoi,
                        th_dai_dien_pb: element.th_dai_dien_pb,
                        thuhoi_ngay: element.thuhoi_ngay,
                        thuhoi_hoanthanh: element.thuhoi_hoanthanh,
                        thuhoi_soluong: element.thuhoi_soluong,
                        type_thuhoi: element.type_thuhoi,
                        thuhoi_trangthai: element.thuhoi_trangthai,
                        thuhoi__lydo: element.thuhoi__lydo,
                        loai_thuhoi: element.loai_thuhoi,
                        thuhoi_type_quyen: element.thuhoi_type_quyen,
                        thuhoi_id_ng_xoa: element.thuhoi_id_ng_xoa,
                        xoa_thuhoi: element.xoa_thuhoi,
                        thuhoi_date_create: element.thuhoi_date_create,
                        thuhoi_date_delete: element.thuhoi_date_delete,
                        th_type_quyen_xoa: element.th_type_quyen_xoa,
                        th_ly_do_tu_choi_ban_giao: element.th_ly_do_tu_choi_ban_giao,
                        th_ly_do_tu_choi_nhan: element.th_ly_do_tu_choi_nhan,
                        th_ly_do_tu_choi_thuhoi: element.th_ly_do_tu_choi_thuhoi,
                    })
                    await ThuHoi.save()

                }
                page++;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}
exports.toolThongBao = async (req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb: 27 })
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const html = JSON.stringify(element.html);
                    // let updateAt = element.update_time;
                    // if (updateAt == 0) {
                    //     updateAt = null;
                    // };
                    const ThongBaos = new ThongBao({
                        _id: element.id_tb,
                        id_ts: element.id_ts,
                        id_cty: element.id_cty,
                        id_ng_nhan: element.id_ng_nhan,
                        id_ng_tao: element.id_ng_tao,
                        type_quyen: element.type_quyen,
                        type_quyen_tao: element.type_quyen_tao,
                        loai_tb: element.loai_tb,
                        add_or_duyet: element.add_or_duyet,
                        da_xem: element.da_xem,
                        date_create: element.date_create,
                    })
                    await ThongBaos.save()

                }
                page++;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}
exports.toolTheoDoiCongSuat = async (req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb: 26 })
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const html = JSON.stringify(element.html);
                    // let updateAt = element.update_time;
                    // if (updateAt == 0) {
                    //     updateAt = null;
                    // };
                    const theoDoi = new TheoDoiCongSuat({
                        _id: element.id_cs,
                        id_cty: element.id_cty,
                        id_loai: element.id_loai,
                        id_donvi: element.id_donvi,
                        update_cs_theo: element.update_cs_theo,
                        nhap_ngay: element.nhap_ngay,
                        chon_ngay: element.chon_ngay,
                        cs_gannhat: element.cs_gannhat,
                        tdcs_type_quyen: element.tdcs_type_quyen,
                        tdcs_id_ng_xoa: element.tdcs_id_ng_xoa,
                        tdcs_xoa: element.tdcs_xoa,
                        tdcs_date_create: element.tdcs_date_create,
                        tdcs_date_delete: element.tdcs_date_delete,
                        date_update: element.date_update,
                        tdcs_type_quyen_xoa: element.tdcs_type_quyen_xoa,
                    })
                    await theoDoi.save()

                }
                page++;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}
exports.toolThanhLy = async (req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb: 25 })
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const html = JSON.stringify(element.html);
                    // let updateAt = element.update_time;
                    // if (updateAt == 0) {
                    //     updateAt = null;
                    // };
                    const sell = new ThanhLy({
                        _id: element.tl_id,
                        thanhly_taisan: element.thanhly_taisan,
                        tl_id_bb_cp: element.tl_id_bb_cp,
                        id_cty: element.id_cty,
                        id_ngtao: element.id_ngtao,
                        id_tl_phongban: element.id_tl_phongban,
                        id_ngdexuat: element.id_ngdexuat,
                        id_ng_duyet: element.id_ng_duyet,
                        ngay_duyet: element.ngay_duyet,
                        type_quyen_duyet: element.type_quyen_duyet,
                        tl_ngay: element.tl_ngay,
                        tl_soluong: element.tl_soluong,
                        tl_giatri: element.tl_giatri,
                        tl_sotien: element.tl_sotien,
                        tl_lydo: element.tl_lydo,
                        tl_lydo_tuchoi: element.tl_lydo_tuchoi,
                        tl_trangthai: element.tl_trangthai,
                        tl_loai_gt: element.tl_loai_gt,
                        tl_phantram: element.tl_phantram,
                        tl_type_quyen: element.tl_type_quyen,
                        tl_id_ng_xoa: element.tl_id_ng_xoa,
                        xoa_dx_tl: element.xoa_dx_tl,
                        tl_date_create: element.tl_date_create,
                        tl_date_delete: element.tl_date_delete,
                        tl_type_quyen_xoa: element.tl_type_quyen_xoa,
                    })
                    await sell.save()

                }
                page++;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}
exports.toolTaiSanDangSuDung = async (req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb: 23 })
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const html = JSON.stringify(element.html);
                    // let updateAt = element.update_time;
                    // if (updateAt == 0) {
                    //     updateAt = null;
                    // };
                    const capital = new TaiSanDangSuDung({
                        _id: element.id_sd,
                        com_id_sd: element.com_id_sd,
                        id_nv_sd: element.id_nv_sd,
                        id_pb_sd: element.id_pb_sd,
                        id_ts_sd: element.id_ts_sd,
                        sl_dang_sd: element.sl_dang_sd,
                        doi_tuong_dang_sd: element.doi_tuong_dang_sd,
                        day_bd_sd: element.day_bd_sd,
                        tinhtrang_ts: element.tinhtrang_ts,
                    })
                    await capital.save()

                }
                page++;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}
exports.toolTaiSanDaiDienNhan = async (req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb: 22 })
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const html = JSON.stringify(element.html);
                    // let updateAt = element.update_time;
                    // if (updateAt == 0) {
                    //     updateAt = null;
                    // };
                    const capital = new TaiSanDaiDienNhan({
                        _id: element.id_dd_nhan,
                        id_cty_dd: element.id_cty_dd,
                        id_ts_dd_nhan: element.id_ts_dd_nhan,
                        id_nv_dd_nhan: element.id_nv_dd_nhan,
                        sl_dd_nhan: element.sl_dd_nhan,
                        day_dd_nhan: element.day_dd_nhan,
                    })
                    await capital.save()

                }
                page++;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}

exports.toolCapPhat = async (req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb: 3 })
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    const html = JSON.stringify(element.html);
                    // let updateAt = element.update_time;
                    // if (updateAt == 0) {
                    //     updateAt = null;
                    // };
                    const capPhat = new CapPhat({
                        _id: element.cp_id,
                        cap_phat_taisan: element.cap_phat_taisan,
                        id_cty: element.id_cty,
                        id_nhanvien: element.id_nhanvien,
                        id_phongban: element.id_phongban,
                        id_ng_daidien: element.id_ng_daidien,
                        id_ng_thuchien: element.id_ng_thuchien,
                        ts_daidien_nhan: element.ts_daidien_nhan,
                        cp_ngay: element.cp_ngay,
                        cp_hoanthanh: element.cp_hoanthanh,
                        cp_trangthai: element.cp_trangthai,
                        loai_capphat: element.loai_capphat,
                        cp_vitri_sudung: element.cp_vitri_sudung,
                        cp_lydo: element.cp_lydo,
                        cp_type_quyen: element.cp_type_quyen,
                        cp_id_ng_tao: element.cp_id_ng_tao,
                        cp_id_ng_xoa: element.cp_id_ng_xoa,
                        cp_da_xoa: element.cp_da_xoa,
                        cp_date_create: element.cp_date_create,
                        cp_date_delete: element.cp_date_delete,
                        cp_type_quyen_xoa: element.cp_type_quyen_xoa,
                        cp_tu_choi_ban_giao: element.cp_tu_choi_ban_giao,
                        cp_tu_choi_tiep_nhan: element.cp_tu_choi_tiep_nhan,
                    })
                    await capPhat.save()

                }
                page++;
            } else {
                result = false;
            }
            console.log(page)
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}







//Tinh
exports.toolSuaChua = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listData = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb: 19 });
            let data = listData.data.items;
            if (data.length > 0) {
                data.map(async (item) => {

                    let new_suaChua = new SuaChua({
                        sc_id: item.sc_id,
                        suachua_taisan: item.suachua_taisan,
                        sl_sc: item.sc_id,
                        id_cty: item.id_cty,
                        sc_ng_thuchien: item.sc_ng_thuchien,
                        sc_ng_duyet: item.sc_ng_duyet,
                        sc_date_duyet: item.sc_date_duyet,
                        sc_trangthai: item.sc_trangthai,
                        sc_ngay: item.sc_ngay,
                        sc_dukien: item.sc_dukien,
                        sc_hoanthanh: item.sc_hoanthanh,
                        sc_noidung: item.sc_noidung,
                        sc_chiphi_dukien: item.sc_chiphi_dukien,
                        sc_chiphi_thucte: item.sc_chiphi_thucte,
                        sc_donvi: item.sc_donvi,
                        sc_loai_diadiem: item.sc_loai_diadiem,
                        sc_diachi: item.sc_diachi,
                        sc_ngay_nhapkho: item.sc_ngay_nhapkho,
                        sc_lydo_tuchoi: item.sc_lydo_tuchoi,
                        sc_type_quyen: item.sc_type_quyen,
                        sc_id_ng_tao: item.sc_id_ng_tao,
                        sc_id_ng_xoa: item.sc_id_ng_xoa,
                        sc_da_xoa: item.sc_da_xoa,
                        sc_date_create: item.sc_date_create,
                        sc_date_delete: item.sc_date_delete,
                        sc_ng_sd: item.sc_ng_sd,
                        sc_quyen_sd: item.sc_quyen_sd,
                        sc_ts_vitri: item.sc_ts_vitri,
                        sc_type_quyen_xoa: item.sc_type_quyen_xoa,
                        sc_type_quyet_duyet: item.sc_type_quyet_duyet,

                    });
                    await new_suaChua.save();


                })
                page++;
                console.log(page);
            } else {
                result = false;
            }
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}

exports.toolTaiSan = async (req, res, next) => {
    let page = 1;
    let result = true;
    try {
        do {
            let data = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb: 20 });
            let listItem = data.data.items;
            if (listItem.length > 0) {
                listItem.map(async (item) => {
                    let new_Taisan = new TaiSan({
                        ts_id: item.ts_id,
                        id_cty: item.id_cty,
                        id_loai_ts: item.id_loai_ts,
                        id_nhom_ts: item.id_nhom_ts,
                        id_dv_quanly: item.id_dv_quanly,
                        id_ten_quanly: item.id_ten_quanly,
                        ts_ten: item.ts_ten,
                        sl_bandau: item.sl_bandau,
                        ts_so_luong: item.ts_so_luong,
                        soluong_cp_bb: item.soluong_cp_bb,
                        ts_gia_tri: item.ts_gia_tri,
                        ts_don_vi: item.ts_don_vi,
                        ts_vi_tri: item.ts_vi_tri,
                        ts_trangthai: item.ts_trangthai,
                        ts_date_sd: item.ts_date_sd,
                        ts_type_quyen: item.ts_type_quyen,
                        ts_type_quyen_xoa: item.ts_type_quyen_xoa,
                        ts_id_ng_xoa: item.ts_id_ng_xoa,
                        ts_da_xoa: item.ts_da_xoa,
                        ts_date_create: item.ts_date_create,
                        ts_date_delete: item.ts_date_delete,
                        don_vi_tinh: item.don_vi_tinh,
                        ghi_chu: item.ghi_chu,
                    });
                    await new_Taisan.save();
                });
                page++;
                console.log(page);
            } else {
                result = false;
            }
        } while (result);
        return fnc.success(res, 'Thành công')
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}

exports.toolQuaTrinhSuDung = async (req, res, next) => {
    let page = 1;
    let result = true;
    try {
        do {
            let data = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb: 17 });
            let listItem = data.data.items;
            if (listItem.length > 0) {
                listItem.map(async (item) => {
                    let new_QuanTrinhSuDung = new QuanTrinhSuDung({
                        quatrinh_id: item.quatrinh_id,
                        id_ts: item.id_ts,
                        id_bien_ban: item.id_bien_ban,
                        so_lg: item.so_lg,
                        id_cty: item.id_cty,
                        id_ng_sudung: item.id_ng_sudung,
                        id_phong_sudung: item.id_phong_sudung,
                        id_cty_sudung: item.id_cty_sudung,
                        qt_ngay_thuchien: item.qt_ngay_thuchien,
                        qt_nghiep_vu: item.qt_nghiep_vu,
                        vitri_ts: item.vitri_ts,
                        ghi_chu: item.ghi_chu,
                        time_created: item.time_created,

                    });
                    await new_QuanTrinhSuDung.save()
                })
                page++;
                console.log(page);

            } else {
                result = false;
            }
        } while (result);
        return fnc.success(res, 'Thành công');
    } catch (error) {
        console.log(error);
        return fnc.setError(res, error.message);
    }
}
