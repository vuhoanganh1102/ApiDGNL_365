const functions = require('../../services/functions')
const TaiSan = require('../../models/QuanLyTaiSan/TaiSan')
const LoaiTaiSan = require('../../models/QuanLyTaiSan/LoaiTaiSan')
const NhomTaiSan = require('../../models/QuanLyTaiSan/NhomTaiSan')
const CapPhat = require('../../models/QuanLyTaiSan/CapPhat')
const ThuHoi = require('../../models/QuanLyTaiSan/ThuHoi')
const DieuChuyen = require('../../models/QuanLyTaiSan/DieuChuyen')
const SuaChua = require('../../models/QuanLyTaiSan/Sua_chua')
const BaoDuong = require('../../models/QuanLyTaiSan/BaoDuong')
const Quydinh_bd = require('../../models/QuanLyTaiSan/Quydinh_bd')
const DonViCS = require('../../models/QuanLyTaiSan/DonViCS')
const Mat = require('../../models/QuanLyTaiSan/Mat')
const Huy = require('../../models/QuanLyTaiSan/Huy')
const ThanhLy = require('../../models/QuanLyTaiSan/ThanhLy')
const KiemKe = require('../../models/QuanLyTaiSan/KiemKe')
const qlts = require('../../services/QLTS/qltsService')
// dữ liệu xoá trang chủ
exports.dataDeleteHome = async (req, res, next) => {
    try {
        // khai báo biến lấy dữ liệu từ token
        let comId = req.comId;

        // khai báo biến phụ
        let data = {};

        // logic
        let demts = await TaiSan.countDocuments({ ts_da_xoa: 1, id_cty: comId });
        let loai_ts = await LoaiTaiSan.countDocuments({ loai_da_xoa: 1, id_cty: comId });
        let nhom_ts = await NhomTaiSan.countDocuments({ nhom_da_xoa: 1, id_cty: comId });
        let ds_ts = demts + loai_ts + nhom_ts;
        let demcp = await CapPhat.countDocuments({ cp_da_xoa: 1, id_cty: comId });
        let demth = await ThuHoi.countDocuments({ xoa_thuhoi: 1, id_cty: comId });
        let demcp_th = demcp + demth;
        let demsc = await SuaChua.countDocuments({ sc_da_xoa: 1, id_cty: comId });
        let dembd = await BaoDuong.countDocuments({ xoa_bd: 1, id_cty: comId });
        let demqd = await Quydinh_bd.countDocuments({ qd_xoa: 1, id_cty: comId });
        let demcs = await DonViCS.countDocuments({ donvi_xoa: 1, id_cty: comId });
        let demsc_bd = demsc + dembd + demqd + demcs;
        let demmat = await Mat.countDocuments({ xoa_dx_mat: 1, id_cty: comId });
        let demhuy = await Huy.countDocuments({ xoa_huy: 1, id_cty: comId });
        let demtl = await ThanhLy.countDocuments({ xoa_dx_tl: 1, id_cty: comId });
        let dem_mht = demmat + demhuy + demtl;
        let demdc = await DieuChuyen.countDocuments({ xoa_dieuchuyen: 1, id_cty: comId });
        let demkk = await KiemKe.countDocuments({ xoa_kiem_ke: 1, id_cty: comId });

        data.danhSachTaiSan = ds_ts;
        data.capPhatThuHoi = demcp_th;
        data.dieuChuyen = demdc;
        data.suaChuaBaoDuong = demsc_bd;
        data.matHuyThanhLy = dem_mht;
        data.kiemKe = demkk;
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        console.error(error)
        return functions.setError(res, error)
    }
};

// danh sách tài sản đã xoá
exports.dataTaiSanDeleted = async (req, res, next) => {
    try {
        // khai báo biến lấy dữ liệu từ token
        let comId = req.comId;
        let emId = req.emId;
        let type_quyen = req.type;

        // khai báo biến người dùng nhập vào
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize) || 10;
        // logic phân trang
        let skip = (page - 1) * pageSize;
        let limit = pageSize;
        // giải thích biến type  1: danh sách tài sản 2: loại tài sản 3: nhóm tài sản
        let type = Number(req.body.type)
        let so_bb = Number(req.body.so_bb);
        let conditions = {}
        // logic
        if (so_bb && type === 1) {
            conditions = { $or: [{ ts_ten: new RegExp(so_bb, 'i') }, { ts_id: { $regex: so_bb } }] }
        }
        if (so_bb && type === 2) {
            conditions = { $or: [{ ten_loai: new RegExp(so_bb, 'i') }, { id_loai: { $regex: so_bb } }] }
        }
        if (so_bb && type === 3) {
            conditions = { $or: [{ ten_nhom: new RegExp(so_bb, 'i') }, { id_nhom: { $regex: so_bb } }] }
        }
        let dem = {};
        let demts = await TaiSan.find({ ts_da_xoa: 1, id_cty: comId }).count();

        let demloai = await LoaiTaiSan.find({ loai_da_xoa: 1, id_cty: comId }).count();

        let demnhom = await NhomTaiSan.find({ nhom_da_xoa: 1, id_cty: comId }).count();
        dem.demts = demts;
        dem.demloai = demloai;
        dem.demnhom = demnhom;

        // 1: loại tài sản đã xoá
        if (type === 1) {
            return qlts.taiSanXoa(res, TaiSan, dem, conditions, skip, limit, comId);
        }
        // 2: loại tài sản đã xoá
        if (type === 2) {
            return qlts.loaiTaiSanXoa(res, LoaiTaiSan, dem, conditions, skip, limit);
        }
        // 3: nhóm tài sản đã xoá
        if (type === 3) {
            return qlts.nhomTaiSanDaXoa(res, NhomTaiSan, dem, conditions, skip, limit, LoaiTaiSan);
        }
        return functions.setError(res, 'invalid type input', 400)
    } catch (error) {
        return functions.setError(res, error)
    }
};

// danh sách tài sản cấp phát thu hồi đã xoá
exports.dataThuHoi