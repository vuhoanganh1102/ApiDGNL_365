const DieuChuyen = require("../../../models/QuanLyTaiSan/DieuChuyen")
const functions = require('../../../services/functions')



exports.showDieuChuyenDoiTuong = async (req, res) => {
    try {
        let { dc_id, page, perPage } = req.body
        let com_id = '';
        if (req.user.data.type == 1 || req.user.data.type == 2) {
            com_id = req.user.data.com_id;
        } else {
            return functions.setError(res, 'không có quyền truy cập', 400);
        }
        page = page || 1;
        perPage = perPage || 10;
        let query = {
            xoa_dieuchuyen: 0,
        };
        const startIndex = (page - 1) * perPage;
        const endIndex = page * perPage;
        if (dc_id) {
            query.dc_id = dc_id;
        }
        const showDieuChuyen = await DieuChuyen.find({ id_cty: com_id, ...query })
            .sort({ dc_id: -1 })
            .skip(startIndex)
            .limit(perPage);
        const totalTsCount = await DieuChuyen.countDocuments({ id_cty: com_id, ...query });

        // Tính toán số trang và kiểm tra xem còn trang kế tiếp hay không
        const totalPages = Math.ceil(totalTsCount / perPage);
        const hasNextPage = endIndex < totalTsCount;

        return functions.success(res, 'get data success', { showDieuChuyen, totalPages, hasNextPage });
    } catch (error) {
        console.error('Failed ', error);
        return functions.setError(res, error);
    }
}