const BaoDuong = require('../../models/QuanLyTaiSan/BaoDuong');
const LoaiTS = require('../../models/QuanLyTaiSan/LoaiTaiSan');
const TaiSan = require('../../models/QuanLyTaiSan/TaiSan');
const ViTriTs = require('../../models/QuanLyTaiSan/ViTri_ts');
const fnc = require('../../services/functions');
const Nhomts = require('../../models/QuanLyTaiSan/NhomTaiSan');
const TaiSanVT = require('../../models/QuanLyTaiSan/TaiSanVitri')
const PhanQuyen = require('../../models/QuanLyTaiSan/PhanQuyen')
const axios = require('axios');
const vi_tri_ts = require('../../models/QuanLyTaiSan/ViTri_ts')
const ThuHoiTaiSan = require('../../models/QuanLyTaiSan/ThuHoi')
const ThongTinTuyChinh = require('../../models/QuanLyTaiSan/ThongTinTuyChinh')
const ThongBao = require('../../models/QuanLyTaiSan/ThongBao')
const TheoDoiCongSuat = require('../../models/QuanLyTaiSan/TheoDoiCongSuat')
const ThanhLy = require('../../models/QuanLyTaiSan/ThanhLy')
const TaiSanDangSuDung = require('../../models/QuanLyTaiSan/TaiSanDangSuDung')
const TaiSanDaiDienNhan = require('../../models/QuanLyTaiSan/TaiSanDaiDienNhan')
const CapPhat = require('../../models/QuanLyTaiSan/CapPhat')
const KiemKe = require('../../models/QuanLyTaiSan/KiemKe');
const QuaTrinhSuDung = require('../../models/QuanLyTaiSan/QuaTrinhSuDung');

const Huy = require('../../models/QuanLyTaiSan/Huy')
const Mat = require('../../models/QuanLyTaiSan/Mat')








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

                    const ThongBaos = new ThongBao({
                        id_tb: element.id_tb,
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

//Lâm
exports.toolLoaits = async (req, res) => {
    try {
        let result = true;
        page = 1;
        do {
            let data = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb: 11 });
            let listData = data.data.items;
            if (listData.length > 0) {
                for (let i = 0; i < listData.length; i++) {
                    const save = new LoaiTS({
                        id_loai: listData[i].id_loai,
                        ten_loai: listData[i].ten_loai,
                        id_nhom_ts: listData[i].id_nhom_ts,
                        id_cty: listData[i].id_cty,
                        loai_type_quyen: listData[i].loai_type_quyen,
                        loai_id_ng_xoa: listData[i].loai_id_ng_xoa,
                        loai_da_xoa: listData[i].loai_da_xoa,
                        loai_date_create: listData[i].loai_date_create,
                        loai_date_delete: listData[i].loai_date_delete,
                        loai_type_quyen_xoa: listData[i].loai_type_quyen_xoa,

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

//lâm
exports.toolTaisan = async (req, res, next) => {
    try {
        let result = true;
        page = 1;
        do {
            let data = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb : 20 });
            let listData = data.data.items;
            if (listData.length > 0) {
                for (let i = 0; i < listData.length; i++) {
                    const save = new TaiSan({
                        ts_id: listData[i].ts_id,
                        id_cty: listData[i].id_cty,
                        id_loai_ts: listData[i].id_loai_ts,
                        id_nhom_ts: listData[i].id_nhom_ts,
                        id_dv_quanly: listData[i].id_dv_quanly,
                        id_ten_quanly: listData[i].id_ten_quanly,
                        ts_ten: listData[i].ts_ten,
                        sl_bandau: listData[i].sl_bandau,
                        ts_so_luong: listData[i].ts_so_luong,
                        soluong_cp_bb: listData[i].soluong_cp_bb,
                        ts_gia_tri: listData[i].ts_gia_tri,
                        ts_don_vi: listData[i].ts_don_vi,
                        ts_vi_tri: listData[i].ts_vi_tri,
                        ts_trangthai: listData[i].ts_trangthai,
                        ts_date_sd: listData[i].ts_date_sd,
                        ts_type_quyen: listData[i].ts_type_quyen,
                        ts_type_quyen_xoa: listData[i].ts_type_quyen_xoa,
                        ts_id_ng_xoa: listData[i].ts_id_ng_xoa,
                        ts_da_xoa: listData[i].ts_da_xoa,
                        ts_date_create: listData[i].ts_date_create,
                        ts_date_delete: listData[i].ts_date_delete,
                        don_vi_tinh: listData[i].don_vi_tinh,
                        ghi_chu: listData[i].ghi_chu
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


//lam
exports.toolViTriTS = async (req, res, next) => {
    try {
        let result = true;
        page = 1;
        do {
            let data = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb: 30 });
            let listData = data.data.items;
            if (listData.length > 0) {
                for (let i = 0; i < listData.length; i++) {
                    const save = new ViTriTs({
                        id_vitri: listData[i].id_vitri,
                        id_cty: listData[i].id_cty,
                        vi_tri: listData[i].vi_tri,
                        dv_quan_ly: listData[i].dv_quan_ly,
                        quyen_dv_qly: listData[i].quyen_dv_qly,
                        ghi_chu_vitri: listData[i].ghi_chu_vitri
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

//lam
exports.toolNhomts = async (req, res, next) => {
    try {
        let result = true;
        page = 1;
        do {
            let data = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb: 14 });
            let listData = data.data.items;
            if (listData.length > 0) {
                for (let i = 0; i < listData.length; i++) {
                    const save = new Nhomts({
                        id_nhom: listData[i].id_nhom,
                        ten_nhom: listData[i].ten_nhom,
                        id_cty: listData[i].id_cty,
                        nhom_type_quyen: listData[i].nhom_type_quyen,
                        nhom_id_ng_xoa: listData[i].nhom_id_ng_xoa,
                        nhom_da_xoa: listData[i].nhom_da_xoa,
                        nhom_date_create: listData[i].nhom_date_create,
                        nhom_date_delete: listData[i].nhom_date_delete,
                        nhom_type_quyen_xoa: listData[i].nhom_type_quyen_xoa,
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

exports.toolTSvitri = async (req, res, next) => {
    try {
        let result = true;
        page = 1;
        do {
            let data = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb: 21 });
            let listData = data.data.items;
            if (listData.length > 0) {
                for (let i = 0; i < listData.length; i++) {
                    const save = new TaiSanVT({
                        tsvt_id: listData[i].tsvt_id,
                        tsvt_cty: listData[i].tsvt_cty,
                        tsvt_taisan: listData[i].tsvt_taisan,
                        tsvt_vitri: listData[i].tsvt_vitri,
                        tsvt_soluong: listData[i].tsvt_soluong
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

exports.toolPhanQuyen = async (req, res, next) => {
    try {
        let result = true;
        page = 1;
        do {
            let data = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb: 16 });
            let listData = data.data.items;
            if (listData.length > 0) {
                for (let i = 0; i < listData.length; i++) {
                    const save = new PhanQuyen({
                        id_phanquyen: listData[i].id_phanquyen,
                        id_user: listData[i].id_user,
                        id_cty: listData[i].id_cty,
                        ds_ts: listData[i].ds_ts,
                        capphat_thuhoi: listData[i].capphat_thuhoi,
                        dieuchuyen_bangiao: listData[i].dieuchuyen_bangiao,
                        suachua_baoduong: listData[i].suachua_baoduong,
                        mat_huy_tl: listData[i].mat_huy_tl,
                        ql_nhanvien: listData[i].ql_nhanvien,
                        phan_quyen: listData[i].phan_quyen,
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
// tool cường
exports.toolMat = async (req, res, next) => {
    try {
        let result = true;
        page = 1;
        do {
            let data = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb: 12 });
            let listData = data.data.items;
            if (listData.length > 0) {
                for (let i = 0; i < listData.length; i++) {
                    const save = new Mat({
                        mat_id: listData[i].mat_id,
                        id_cty: listData[i].id_cty,
                        mat_taisan: listData[i].mat_taisan,
                        id_ng_lam_mat: listData[i].id_ng_lam_mat,
                        id_ng_nhan_denbu: listData[i].id_ng_nhan_denbu,
                        id_ng_tao: listData[i].id_ng_tao,
                        id_ng_duyet: listData[i].id_ng_duyet,
                        mat_type_quyen_duyet: listData[i].mat_type_quyen_duyet,
                        mat_giatri: listData[i].mat_giatri,
                        yc_denbu: listData[i].yc_denbu,
                        mat_ngay: listData[i].mat_ngay,
                        hinhthuc_denbu: listData[i].hinhthuc_denbu,
                        mat_soluong: listData[i].mat_soluong,
                        tien_denbu: listData[i].tien_denbu,
                        mat_trangthai: listData[i].mat_trangthai,
                        mat_lydo: listData[i].mat_lydo,
                        mat_lydo_tuchoi: listData[i].mat_lydo_tuchoi,
                        mat_han_ht: listData[i].mat_han_ht,
                        pt_denbu: listData[i].pt_denbu,
                        giatri_ts: listData[i].giatri_ts,
                        loai_thanhtoan: listData[i].loai_thanhtoan,
                        ngay_thanhtoan: listData[i].ngay_thanhtoan,
                        so_tien_da_duyet: listData[i].so_tien_da_duyet,
                        sotien_danhan: listData[i].sotien_danhan,
                        ngay_duyet: listData[i].ngay_duyet,
                        mat_type_quyen: listData[i].mat_type_quyen,
                        type_quyen_nhan_db: listData[i].type_quyen_nhan_db,
                        mat_id_ng_xoa: listData[i].mat_id_ng_xoa,
                        xoa_dx_mat: listData[i].xoa_dx_mat,
                        mat_date_create: listData[i].mat_date_create,
                        mat_date_delete: listData[i].mat_date_delete,
                        mat_type_quyen_xoa: listData[i].mat_type_quyen_xoa,
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

exports.toolHuy = async (req, res, next) => {
    try {
        let result = true;
        page = 1;
        do {
            let data = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb: 8 });
            let listData = data.data.items;
            if (listData.length > 0) {
                for (let i = 0; i < listData.length; i++) {
                    let str = listData[i].huy_taisan
                    str = str.replaceAll('[[','')
                    str = str.replaceAll(']]','')
                    str = str.replaceAll('"','')
                    str = str.replaceAll('ds_huy:','')
                    str = str.replaceAll('{','')
                    str = str.replaceAll('}','')
                    let huy_taisan = [];
                    str.split(',').map((item)=>{
                        huy_taisan.push({ds_huy:`${item}`})
                    })
                    const save = new Huy({
                        huy_id: listData[i].huy_id,
                        huy_taisan: huy_taisan,
                        id_ng_dexuat: listData[i].id_ng_dexuat,
                        huy_id_bb_cp: listData[i].huy_id_bb_cp,
                        id_cty: listData[i].id_cty,
                        id_ng_tao: listData[i].id_ng_tao,
                        id_ng_duyet: listData[i].id_ng_duyet,
                        huy_type_quyen_duyet: listData[i].huy_type_quyen_duyet,
                        huy_ngayduyet: listData[i].huy_ngayduyet,
                        huy_trangthai: listData[i].huy_trangthai,
                        huy_soluong: listData[i].huy_soluong,
                        huy_lydo_tuchoi: listData[i].huy_lydo_tuchoi,
                        huy_lydo: listData[i].huy_lydo,
                        huy_type_quyen: listData[i].huy_type_quyen,
                        huy_id_ng_xoa: listData[i].huy_id_ng_xoa,
                        xoa_huy: listData[i].xoa_huy,
                        huy_date_create: listData[i].huy_date_create,
                        huy_date_delete: listData[i].huy_date_delete,
                        huy_type_quyen_xoa: listData[i].huy_type_quyen_xoa,
                        huy_ng_sd: listData[i].huy_ng_sd,
                        huy_quyen_sd: listData[i].huy_quyen_sd,
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

exports.toolThanhLy = async (req, res, next) => {
    try {
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
    }

 catch (error) {
    console.log(error);
    return fnc.setError(res, error.message);
}
}
//dung
exports.kiemKe = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const response = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb: 10 });
            let data = response.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    // if (await functions.checkDate(data[i].time_start) === false) continue
                    let id_ts = [];
                    const res = JSON.parse(data[i].id_ts);
                    const array = res.ds_ts;
                    for (let i = 0; i < array.length; i++) {
                        id_ts.push(array[i][0]);
                    }

                    await KiemKe.findOneAndUpdate({ id_kiemke: data[i].id_kiemke },
                        {
                            id_cty: data[i].id_cty,
                            "id_ts.ds_ts": id_ts,
                            id_ngtao_kk: data[i].id_ngtao_kk,
                            id_ngduyet_kk: data[i].id_ngduyet_kk,
                            id_ng_kiemke: data[i].id_ng_kiemke,
                            kk_loai: data[i].kk_loai,
                            kk_loai_time: data[i].kk_loai_time,
                            kk_noidung: data[i].kk_noidung,
                            kk_ky: data[i].kk_ky,
                            kk_denngay: data[i].kk_denngay,
                            kk_donvi: data[i].kk_donvi,
                            kk_batdau: data[i].kk_batdau,
                            kk_ketthuc: data[i].kk_ketthuc,
                            kk_hoanthanh: data[i].kk_hoanthanh,
                            kk_ngayduyet: data[i].kk_ngayduyet,
                            kk_trangthai: data[i].kk_trangthai,
                            kk_tiendo: data[i].kk_tiendo,
                            kk_type_quyen: data[i].kk_type_quyen,
                            kk_id_ng_xoa: data[i].kk_id_ng_xoa,
                            xoa_kiem_ke: data[i].xoa_kiem_ke,
                            kk_date_create: data[i].kk_date_create,
                            kk_date_delete: data[i].kk_date_delete,
                            kk_type_quyen_xoa: data[i].kk_type_quyen_xoa,
                            kk_type_quyen_duyet: data[i].kk_type_quyen_duyet,
                        },
                        { upsert: true });
                }
                page++;
            } else {
                result = false;
            }
        } while (result);
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.QuaTrinhSuDung = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const response = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb: 17 });
            let data = response.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    await QuaTrinhSuDung.findOneAndUpdate({ quatrinh_id: data[i].quatrinh_id },
                        {
                            id_ts: data[i].id_ts,
                            id_bien_ban: data[i].id_bien_ban,
                            so_lg: data[i].so_lg,
                            id_cty: data[i].id_cty,
                            id_ng_sudung: data[i].id_ng_sudung,
                            id_phong_sudung: data[i].id_phong_sudung,
                            id_cty_sudung: data[i].id_cty_sudung,
                            qt_ngay_thuchien: data[i].qt_ngay_thuchien,
                            qt_nghiep_vu: data[i].qt_nghiep_vu,
                            vitri_ts: data[i].vitri_ts,
                            ghi_chu: data[i].ghi_chu,
                            time_created: data[i].time_created
                        },
                        { upsert: true });
                }
                page++;
            } else {
                result = false;
            }
        } while (result);
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

