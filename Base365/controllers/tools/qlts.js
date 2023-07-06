let BaoDuong = require('../../models/QuanLyTaiSan/BaoDuong');
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