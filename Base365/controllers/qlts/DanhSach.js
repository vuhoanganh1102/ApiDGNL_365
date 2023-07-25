const fnc = require('../../services/functions');
const ViTriTaiSan = require('../../models/QuanLyTaiSan/ViTri_ts');
const TaiSan = require('../../models/QuanLyTaiSan/TaiSan');

//page dieu chuyen vi tri
exports.list_vitri = async (req, res) => {
    try {
        let com_id = req.user.data.com_id;
        let arr_vitri = await ViTriTaiSan.aggregate([
            {
                $match: {
                    id_cty: com_id
                }
            },
            {
                $project: {
                    'id_vitri': '$id_vitri',
                    'vi_tri': '$vi_tri'
                }
            }
        ]
        );
        fnc.success(res, 'success ', arr_vitri);

    } catch (error) {
        console.log(error);
        fnc.setError(res, error);
    }
}

exports.listTaiSan = async (req, res) => {
    try {
        let { ts_vi_tri } = req.body;
        let com_id = req.user.data.com_id;

        let list_TS = await TaiSan.aggregate([
            {
                $match: {
                    id_cty: com_id,
                    ts_vi_tri: ts_vi_tri,
                }
            },
            {
                $project: {
                    'id_ts': '$ts_id',
                    'ten_ts': '$ts_ten',
                    'ts_vi_tri': '$ts_vi_tri'
                }
            }
        ]);
        fnc.success(res, 'sucess', list_TS);
    } catch (error) {
        console.log(error);
        fnc.setError(res, error);
    }
}

exports.DetailTS = async (req, res) => {
    try {
        let { id_ts, ts_vi_tri } = req.body;
        let com_id = req.user.data.com_id;
        let taisan = await TaiSan.find({
            ts_id: {
                $in: id_ts
            },
            id_cty: com_id,
            ts_vi_tri: ts_vi_tri
        })
        fnc.success(res, 'OK', taisan);
    } catch (error) {
        fnc.setError(res, error);

    }

}
//page bao duong - sua_chua
exports.listTS = async (req, res) => {
    try {
        let com_id = req.user.data.com_id;

        let list_TS = await TaiSan.aggregate([
            {
                $match: {
                    id_cty: com_id,

                }
            },
            {
                $project: {
                    'id_ts': '$ts_id',
                    'ten_ts': '$ts_ten',
                    'ts_vi_tri': '$ts_vi_tri'
                }
            }
        ]);
        fnc.success(res, 'sucess', list_TS);

    } catch (error) {
        fnc.setError(res, error);
    }
}