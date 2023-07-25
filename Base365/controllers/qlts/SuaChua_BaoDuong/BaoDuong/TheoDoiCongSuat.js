const fnc = require('../../../../services/functions');
const functions = require('../../../../services/QLTS/qltsService');
const DonViCongSuat = require('../../../../models/QuanLyTaiSan/DonViCS');
const TheoDoiCongSuat = require('../../../../models/QuanLyTaiSan/TheoDoiCongSuat');

//quan ly don  vi do cong suat
exports.add_dvi_csuat = async (req, res) => {
    try {
        let { ten_dv, mota } = req.body;
        let date_create = new Date().getTime();
        let id_cty = req.user.data.com_id;
        let maxId = await functions.maxID_dvcs(DonViCongSuat);
        let insert_dvcs = new DonViCongSuat({
            id_donvi: maxId + 1,
            id_cty: id_cty,
            ten_donvi: ten_dv,
            mota_donvi: mota,
            dvcs_date_create: date_create
        });
        await insert_dvcs.save();
        fnc.success(res, 'add unit suceess', insert_dvcs);

    } catch (error) {


        fnc.setError(res, error.message);

    }
}


exports.detail_dvi_csuat = async (req, res) => {
    try {
        let id_dv = req.body.id_dv;
        let com_id = req.user.data.com_id;

        let info = await DonViCongSuat.findOne({
            id_donvi: id_dv,
            id_cty: com_id
        });
        fnc.success(res, "OK", [info]);
    } catch (error) {

        fnc.setError(error.message);

    }
}

exports.edit_dvi_csuat = async (req, res) => {
    try {
        let { id_donvi_edit, ten_DV, mota } = req.body;
        let com_id = req.user.data.com_id;
        let edit = await DonViCongSuat.findOneAndUpdate({
            id_donvi: id_donvi_edit,
            id_cty: com_id
        }, {
            ten_donvi: ten_DV,
            mota_donvi: mota
        }
        );
        fnc.success(res, "ok", edit);
    } catch (error) {
        fnc.setError(res, error.message);
    }
}
//thoe dõi công suất 
exports.add_do_csuat = async (req, res) => {
    try {
        let com_id = req.user.data.com_id;
        let { loai_ts, capnhattu_theodoics, ten_dv, nhap_ngay } = req.body;
        let ngay_bd_update = nhap_ngay;
        let type_quyen = req.user.data.type;

        let maxid = 0;

        let theodoi_cs = await TheoDoiCongSuat.findOne({}, {}, { sort: { id_cs: -1 } });
        if (theodoi_cs) {
            maxid = theodoi_cs.id_cs;
        }
        let insert = await TheoDoiCongSuat({
            id_cs: maxid + 1,
            id_cty: com_id,
            id_loai: loai_ts,
            id_donvi: ten_dv,
            update_cs_theo: capnhattu_theodoics,
            chon_ngay: ngay_bd_update,
            nhap_ngay: nhap_ngay,
            cs_gannhat: 0,
            tdcs_type_quyen: type_quyen,
            tdcs_xoa: 0,
            tdcs_date_create: new Date().getTime()
        })
        await insert.save();
        fnc.success(res, 'OK', [insert]);
    } catch (error) {
        console.log(error)
        fnc.setError(res, error.message);
    }

}

exports.detail_csuat_tsan = async (req, res) => {
    try {

        let { id, } = req.body;
        let com_id = req.user.data.com_id;

        if (isNaN(id) || id <= 0) {
            return res.statsus(404).json({ message: 'id phai la 1 so lon hon 0' })
        }
        let tdcs = await TheoDoiCongSuat.findOne({
            id_cty: com_id,
            id_cs: id
        });

        fnc.success(res, 'OK', tdcs);

    } catch (error) {
        fnc.setError(res, error.message);
    }
}

exports.update_theodoi_cs = async (req, res) => {
    try {

        let { id, day_update, cs_thuc } = req.body;
        let com_id = req.user.data.com_id;

        if (isNaN(id) || id <= 0) {
            return res.statsus(404).json({ message: 'id phai la 1 so lon hon 0' })
        }
        let update = await TheoDoiCongSuat.findOneAndUpdate({
            id_cs: id,
            id_cty: com_id
        }, {
            date_update: day_update,
            cs_gannhat: cs_thuc
        })
        fnc.success(res, "OK", [update])
    } catch (error) {
        console.log(error);
        fnc.setError(res, error.message);

    }
}