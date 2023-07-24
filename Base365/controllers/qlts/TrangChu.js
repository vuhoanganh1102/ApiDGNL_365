const capPhat = require('../../models/QuanLyTaiSan/CapPhat')
const TaiSan = require('../../models/QuanLyTaiSan/TaiSan')
const fnc = require('../../services/functions')

exports.Home = async(req, res) =>{
    try{
        const id_cty = req.user.data.com_id
        let data = await TaiSan.find({ id_cty: id_cty, ts_da_xoa: 0 })
            let sl_chua_sd = 0;
            let gt_ts_chua_sd = 0;
        console.log(data)
            data.forEach(function(value_ts_chua_sd) {
              sl_chua_sd += value_ts_chua_sd.ts_so_luong;
              gt_ts_chua_sd += value_ts_chua_sd.ts_gia_tri * value_ts_chua_sd.ts_so_luong;
            });
        return fnc.success(res,"lay thanh cong",{data})
    }catch(e){
        return fnc.setError(res, e.message)
    }
}