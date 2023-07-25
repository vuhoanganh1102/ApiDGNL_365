const fnc = require('../../../../services/functions');
const functions = require('../../../../services/QLTS/qltsService');
const DonViCongSuat = require('../../../../models/QuanLyTaiSan/DonViCS');


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

        console.log(error);
        fnc.setError(res, error.message);

    }
}
