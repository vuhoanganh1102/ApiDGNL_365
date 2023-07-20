const functions = require('../../services/functions')
const ThanhLy = require('../../models/QuanLyTaiSan/ThanhLy');
const TaiSan = require('../../models/QuanLyTaiSan/TaiSan');
const ThongBao = require('../../models/QuanLyTaiSan/ThongBao');
const TaiSanDangSuDung = require('../../models/QuanLyTaiSan/TaiSanDangSuDung');
const QuaTrinhSuDung = require('../../models/QuanLyTaiSan/QuaTrinhSuDung');
const Users = require('../../models/Users');
const Department = require('../../models/qlc/Deparment');

// tạo đề xuất tài sản thanh lý
exports.createLiquidationAssetProposal = async (req, res, next) => {
    try {
        // khai báo biến lấy dữ liệu từ token
        let comId = req.comId || 1763;
        let emId = req.emId;
        let type_quyen = req.type || 1;

        // khai báo biến người dùng nhập vào
        let tentstl = Number(req.body.tentstl);
        let sl_tl = Number(req.body.sl_tl);
        let lydo_thanhly = req.body.lydo_thanhly;

        // khai báo biến phụ
        let id_ng_tao = comId;
        let id_ng_dexuat = comId;
        let date = new Date().getTime() / 1000;

        // logic 
        if (type_quyen === 2) {
            id_ng_tao = emId;
            id_ng_dexuat = emId;
        }
        if (sl_tl && lydo_thanhly && tentstl) {
            let check_gt_ts = await TaiSan.findOne({ ts_id: tentstl, id_cty: comId }, { ts_gia_tri: 1 })
            if (check_gt_ts) {
                let gt_ts = check_gt_ts.ts_gia_tri;
                let tl_id = await functions.getMaxIdByField(ThanhLy, 'tl_id');
                // tạo bản ghi bảng thanh lý
                await ThanhLy.create({
                    tl_id,
                    thanhly_taisan: tentstl,
                    id_ngdexuat: id_ng_dexuat,
                    id_cty: comId,
                    id_ngtao: id_ng_tao,
                    tl_soluong: sl_tl,
                    tl_giatri: gt_ts,
                    tl_lydo: lydo_thanhly,
                    tl_type_quyen: type_quyen,
                    tl_date_create: date
                });
                // tạo bản ghi bảng thông báo
                let id_tb = await functions.getMaxIdByField(ThongBao, 'id_tb');
                await ThongBao.create({
                    id_tb,
                    id_cty: comId,
                    id_ng_nhan: comId,
                    id_ng_tao: id_ng_tao,
                    type_quyen: 2,
                    type_quyen_tao: type_quyen,
                    loai_tb: 8,
                    add_or_duyet: 1,
                    da_xem: 0,
                    date_create: date
                })
                return functions.success(res, 'Tạo đề xuất thanh lý tài sản thành công')
            }
            return functions.setError(res, 'Không tìm thấy tài sản', 404)
        }
        return functions.setError(res, 'Missing data input', 400)
    } catch (error) {
        console.error(error)
        return functions.setError(res, error);
    }
};

// danh sách đề xuất tài sản thanh lý
exports.getDataLiquidationAssetProposal = async (req, res, next) => {
    try {
        // khai báo biến lấy dữ liệu từ token
        let comId = req.comId || 1763;
        let emId = req.emId;
        let type_quyen = req.type;

        // khai báo biến người dùng nhập vào
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize) || 10;
        let keywords = Number(req.body.keywords);

        // logic phân trang
        let skip = (page - 1) * pageSize;
        let limit = pageSize;

        // khai báo biến phụ
        let conditions = {};
        let data = {};

        // logic xử lý
        // khai báo điều kiện tìm kiếm
        conditions.id_cty = comId;

        conditions.xoa_dx_tl = 0;

        conditions.tl_trangthai = 3;

        if (keywords) { conditions.tl_id = { $regex: keywords } }

        if (type_quyen === 2) { conditions = { $or: [{ id_ng_tao: emId }, { huy_ng_sd: emId }] } }

        // số lượng tài sản đã thanh lý
        let countTaiSanDaThanhLy = await ThanhLy.find(conditions).count();

        // số lượng tài sản đề xuất thanh lý
        conditions.tl_trangthai = { $in: [0, 2] }
        let countTaiSanDeXuatThanhLy = await ThanhLy.find(conditions).count();



        // dữ liệu tài sản đề xuất thanh lý
        let taiSanDeXuatThanhLy = await ThanhLy.aggregate([
            { $match: conditions },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'QLTS_Tai_San',
                    localField: 'thanhly_taisan',
                    foreignField: 'ts_id',
                    as: 'taisan',
                }
            },
            { $unwind: { path: '$taisan', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'QLTS_Loai_Tai_San',
                    localField: 'taisan.id_loai_ts',
                    foreignField: 'id_loai',
                    as: 'loaiTS',
                }
            },
            { $unwind: { path: "$loaiTS", preserveNullAndEmptyArrays: true } },
        ]);
        for (let i = 0; i < taiSanDeXuatThanhLy.length; i++) {

            // trả về định dạng ngày
            taiSanDeXuatThanhLy[i].tl_date_create = new Date(taiSanDeXuatThanhLy[i].tl_date_create * 1000);

            // lấy quyền người dùng đã đề xuất
            let tl_type_quyen = taiSanDeXuatThanhLy[i].tl_type_quyen;

            // lấy thông tin user
            let user = await Users.findOne({ idQLC: taiSanDeXuatThanhLy[i].id_ngdexuat }, { userName: 1, inForPerson: 1, address: 1 })

            if (tl_type_quyen === 1) {
                taiSanDeXuatThanhLy[i].ngdexuat = user.userName
                taiSanDeXuatThanhLy[i].phongban = user.userName
            }

            if (tl_type_quyen === 2) {
                let dep = await Department.findOne({ dep_id: id_ng_dexuat_em.inForPerson.employee.dep_id })
                taiSanDeXuatThanhLy[i].ngdexuat = user.userName
                taiSanDeXuatThanhLy[i].phongban = dep.dep_name
            }

            if (tl_type_quyen === 3) {
                let dep = await Department.findOne({ dep_id: id_ng_dexuat_em.inForPerson.employee.dep_id })
                taiSanDeXuatThanhLy[i].ngdexuat = dep.dep_name
                taiSanDeXuatThanhLy[i].phongban = dep.dep_name
            }
        }
        // xử lý đầu ra
        data.countTaiSanDeXuatThanhLy = countTaiSanDeXuatThanhLy;
        data.countTaiSanDaThanhLy = countTaiSanDaThanhLy;
        data.taiSanDeXuatThanhLy = taiSanDeXuatThanhLy;

        return functions.success(res, 'get data success', { data })
    } catch (error) {
        console.error(error)
        return functions.setError(res, error);
    }
};

// duyệt đề xuất tài sản thanh lý
exports.approveLiquidationAssetProposal = async (req,res,next) => {
    try {
        // khai báo biến lấy dữ liệu từ token
        let comId = req.comId;
        let emId  = req.emId;
        let type_quyen = req.type;

        // khai báo biến người dùng nhập vào
        let bb_tl = Number(req.body.bb_tl);
        let giatri_TS = Number(req.body.giatri_TS);
        let chon_gt_tl = Number(req.body.chon_gt_tl);
        let day_thanhly = req.body.day_thanhly;
        let soluong_thanhly = Number(req.body.soluong_thanhly);
        let phan_tram_nhap  = Number(req.body.phan_tram_nhap);
        let so_tien_nhap   = Number(req.body.so_tien_nhap);
        let lydo_thanhly = req.body.lydo_thanhly;
        let so_tien_da_tinh = Number(req.body.so_tien_da_tinh);
        let ten_TS_thanhly  = req.body.ten_TS_thanhly;
        // logic 
        let id_ng_duyet = comId;
        if(type_quyen === 2){
            id_ng_duyet = emId;
        }
    } catch (error) {
        return functions.setError(res, error)
    }
};