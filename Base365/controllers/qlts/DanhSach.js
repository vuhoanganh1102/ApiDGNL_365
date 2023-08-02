const fnc = require('../../services/functions');
const ViTriTaiSan = require('../../models/QuanLyTaiSan/ViTri_ts');
const TaiSan = require('../../models/QuanLyTaiSan/TaiSan');
const LoaiTaiSan = require('../../models/QuanLyTaiSan/LoaiTaiSan');
const DonViCongSuat = require('../../models/QuanLyTaiSan/DonViCS');
const dep = require('../../models/qlc/Deparment')
const user = require('../../models/Users')
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
        fnc.success(res, 'success ', { arr_vitri });

    } catch (error) {
        console.log(error);
        fnc.setError(res, error.message);
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
        fnc.success(res, 'sucess', { list_TS });
    } catch (error) {
        console.log(error);
        fnc.setError(res, error.message);
    }
}

exports.DetailTS = async (req, res) => {
    try {
        let { id_ts, ts_vi_tri } = req.body;
        let com_id = req.user.data.com_id;
        let arr = id_ts.split(',');
        let arr_ts = [];
        arr.map((item) => {
            arr_ts.push(Number(item))
        })

        let list_TS = await TaiSan.aggregate([
            {
                $match: {
                    id_cty: com_id,
                    ts_vi_tri: ts_vi_tri,
                    ts_id: {
                        $in: arr_ts
                    }
                }
            },
        ]);
        fnc.success(res, 'sucess', { list_TS });
    } catch (error) {
        console.log(error)
        fnc.setError(res, error.message);

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
        fnc.success(res, 'sucess', { list_TS });

    } catch (error) {
        console.log(error)
        fnc.setError(res, error.message);
    }
}
//page quy địnhbảo dưỡng
exports.listLoaiTaiSan = async (req, res) => {
    try {
        let com_id = req.user.data.com_id;
        let danhsach_loai_ts = await LoaiTaiSan.find({
            id_cty: com_id,
            loai_da_xoa: 0
        })
        fnc.success(res, "ok", { danhsach_loai_ts });
    } catch (error) {
        console.log(error);
        fnc.setError(res, error.message);
    }
}
//page theo doi cong suat 
exports.list_dvi_csuat = async (req, res) => {
    try {
        let com_id = req.user.data.com_id;
        let list_divi = await DonViCongSuat.find({
            id_cty: com_id
        });
        fnc.success(res, "OK", { list_divi });
    } catch (error) {
        console.log(error);
        fnc.setError(res, error.message);
    }
}
exports.list_Dep = async (req, res) => {
    try {
        let com_id = req.user.data.com_id;
        let data = dep.find({
            com_id: com_id
        }).select("dep_id dep_name -_id").sort({dep_id : -1})
        fnc.success(res, "lấy thành công", { data });
    } catch (error) {
        console.log(error);
        fnc.setError(res, error.message);
    }
}
exports.list_Users = async (req, res) => {
    try {
        let com_id = req.user.data.com_id;
        let data = await user.find({
            "inForPerson.employee.com_id": com_id , type :2
        }).select("_id userName").sort({_id : -1})
        fnc.success(res, "lấy thành công", { data });
    } catch (error) {
        console.log(error);
        fnc.setError(res, error.message);
    }
}
exports.list_Com = async (req, res) => {
    try {
        let com_id = req.user.data.com_id;
        let data = await user.find({
           _id: com_id , type : 1
        }).select("_id userName").sort({_id : -1})
        fnc.success(res, "lấy thành công", { data });
    } catch (error) {
        console.log(error);
        fnc.setError(res, error.message);
    }
}

