const functions = require('../../services/functions');
const Mat = require('../../models/QuanLyTaiSan/Mat');
const ThongBao = require('../../models/QuanLyTaiSan/ThongBao');

exports.getListDataLostAssets = async (req,res,next) => {
    try {
        let {page, pageSize, key} = req.body;
        if(!page) page = 1;
        if(!pageSize) pageSize = 10;
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page-1)*pageSize;
        let id_cty = req.com_id;

        let condition = {id_cty: id_cty, xoa_dx_mat: 0, mat_trangthai: {$in: [0, 2]}};
        if(key) condition.mat_id = Number(key);

        let danhSachMat = await Mat.aggregate([
            {$match: condition},
            {
                $lookup: {
                    from: "QLTS_Tai_San",
                    localField: "mat_taisan",
                    foreignField: "ts_id",
                    as: "Tai_San"
                }
            },
            {$sort: {mat_id: -1}},
            {$skip: skip},
            {$limit: pageSize}
        ]);
        const total = await functions.findCount(Mat, condition);
        return functions.success(res,'get data success',{total, danhSachMat})
    } catch (error) {
        return functions.setError(res,error);
    }
};

exports.createMat = async(req, res, next) => {
    try{
        let {ts_mat, giatri_ts, ycdenbu, ngay_mat, hinhthucdb, sl_mat, ngnhandb, nglammat, phantram_nhap, tiendb,
            day_htdenbu, lydo, giatrimat} = req.body;
        if(ts_mat && ngay_mat && nglammat && sl_mat && lydo && day_htdenbu) {
            let type_quyen_nhan_db = 2;
            let id_cty = req.com_id;
            let id_ng_tao = req.idQLC;
            let type_quyen = req.type;
            ngay_mat = new Date(ngay_mat);
            day_htdenbu = new Date(day_htdenbu);
            let today = new Date(Date.now());
            if(ngay_mat <= today) {
                if(day_htdenbu > ngay_mat && day_htdenbu > today) {
                    let mat_id = await functions.getMaxIdByField(Mat, 'mat_id');
                    let fields = {
                        mat_id: mat_id,
                        id_cty: id_cty, 
                        mat_taisan: ts_mat, 
                        id_ng_lam_mat: nglammat, 
                        id_ng_nhan_denbu: ngnhandb, 
                        id_ng_tao: id_ng_tao, 
                        mat_giatri: giatrimat, 
                        yc_denbu: ycdenbu, 
                        mat_ngay: functions.convertTimestamp(ngay_mat), 
                        hinhthuc_denbu: hinhthucdb, 
                        mat_soluong: sl_mat, 
                        tien_denbu: tiendb, 
                        mat_trangthai: 0, 
                        mat_lydo: lydo,
                        mat_han_ht: day_htdenbu, 
                        pt_denbu: phantram_nhap, 
                        giatri_ts: giatri_ts, 
                        mat_type_quyen: type_quyen, 
                        type_quyen_nhan_db: type_quyen_nhan_db, 
                        mat_date_create: functions.convertTimestamp(today)
                    };
                    let mat = new Mat(fields);
                    mat = await mat.save();

                    if(mat) {
                        let id_tb = await functions.getMaxIdByField(ThongBao, 'id_tb');
                        let fieldsTB = {
                            id_tb: id_tb,
                            id_cty: id_cty,
                            id_ng_nhan: id_cty,
                            id_ng_tao: id_ng_tao,
                            type_quyen: 2,
                            type_quyen_tao: type_quyen,
                            loai_tb: 6,
                            add_or_duyet: 1,
                            da_xem: 0,
                            date_create: functions.convertTimestamp(today)
                        }
                        let thongBao = new ThongBao(fieldsTB);
                        thongBao = await thongBao.save();
                        if(thongBao){
                            return functions.success(res, "Tao bien ban mat thanh cong!", mat);
                        }
                        return functions.setError(res, `Tao thong bao that bai`, 506); 
                    }
                    return functions.setError(res, `Tao mat that bai`, 505); 
                }
                return functions.setError(res, `Ngay den bu < ngay mat or ngay den bu > today`, 406);
            }
            return functions.setError(res, `ngay_mat > today `, 405);
        }
        return functions.setError(res, `Missing input value`, 404);
    }catch(e) {
        return functions.setError(res, e.message);
    }
}

exports.duyet = async(req, res, next) => {
    try{

    }catch(e){
        return functions.setError(res, e.message);
    }
}

exports.tuChoi = async(req, res, next) => {
    try{

    }catch(e){
        return functions.setError(res, e.message);
    }
}