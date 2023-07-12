const functions = require('../../services/functions')
const Huy = require('../../models/QuanLyTaiSan/Huy');
const TaiSan = require('../../models/QuanLyTaiSan/TaiSan');

exports.getDataAssetProposeCancel = async (req, res, next) => {
    try {
        let comId = req.comId || 1763;
        let keywords = req.body.keywords;
        let page = req.body.page;
        let pageSize = req.body.pageSize;
        let skip = (page - 1) * pageSize;
        let limit = pageSize;

        // get data from token
        let quyen = req.quyen;
        let emId = req.emId;

        // declare variables conditions 
        let conditions = {};

        if (quyen === 2) {
            conditions = {
                $or: [
                    { id_ng_tao: emId },
                    { huy_ng_sd: emId },
                ]
            }
        } else if (quyen === 1) {
            conditions = {
                $or: [
                    { id_ng_tao: comId },
                    { huy_ng_sd: comId },
                ]
            }
        }
        if (keywords) conditions.huy_id = keywords;

        conditions.id_cty = comId;
        conditions.huy_trangthai = { $in: [0, 2] };
        conditions.xoa_huy = 0;


        let countDxHuy = await Huy.find(conditions).sort({ huy_id: -1 }).skip(skip).limit(limit).count();

        let countTongDxHuy = await Huy.find(conditions).sort({ huy_id: -1 }).count();

        let listAsset = await TaiSan.find({ id_cty: comId, ts_da_xoa: 0, ts_so_luong: { $gte: 0 } }).sort({ ts_id: -1 });

        let listDxHuy = await Huy.find(conditions).sort({ huy_id: -1 }).skip(skip).limit(limit);
        
      
        
        if(listDxHuy && listDxHuy.huy_taisan && listDxHuy.huy_taisan.ds_huy){
            let detailAsset = [];
            for(let i = 0; i < listDxHuy.huy_taisan.ds_huy.length; i++)
            {
                 detailAsset = await TaiSan.aggregate([
                    {
                        $match: {
                            id_cty:comId,ts_id:1800
                        }
                    },
                    {
        
                        $lookup: {
                            from: 'QLTS_Loai_Tai_San',
                            localField: 'id_loai_ts',
                            foreignField: 'id_loai',
                            as: 'loaiTS'
                        }
        
                    }
                ]);
                listDxHuy.push(detailAsset)
            }
        }
       
        
        conditions.huy_trangthai = 1
        let didCancel = await Huy.find(conditions).count();
        let data = {};
        data.countDxHuy = countDxHuy;
        data.countTongDxHuy = countTongDxHuy;
        data.didCancel = didCancel;
        data.listAsset = listAsset;
        data.listDxHuy = listDxHuy;
        data.detailAsset = detailAsset;
        return functions.success(res, 'get data success', { data })
    }
    catch (error) {
        console.error(error)
        return functions.setError(res, error);
    }
}