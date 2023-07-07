const BaoDuong = require('../../models/QuanLyTaiSan/BaoDuong');
const LoaiTS = require('../../models/QuanLyTaiSan/LoaiTaiSan');
const TaiSan = require('../../models/QuanLyTaiSan/TaiSan');
const ViTriTs = require('../../models/QuanLyTaiSan/ViTri_ts');
const fnc = require('../../services/functions');
const axios = require('axios');

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

//Lâm
exports.toolLoaits = async (req,res) => {
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
exports.toolTaisan = async  (req, res, next) => {
    try {
        let result = true;
        page = 1;
        do {
            let data = await fnc.getDataAxios('https://phanmemquanlytaisan.timviec365.vn/api_nodejs/list_all.php', { page: page, pb: 20 });
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

exports.toolViTriTS = async  (req, res, next) => {
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
