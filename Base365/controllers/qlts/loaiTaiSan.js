const LoaiTaiSan = require('../../models/QuanLyTaiSan/LoaiTaiSan');

exports.addLoaiTaiSan = async (req,res) => {

}

exports.showLoaiTs = async (req,res) => {
    try{
        try {
            let { page } = req.body;
            let perPage = req.body || 10 // Số lượng giá trị hiển thị trên mỗi trang
            const startIndex = (page - 1) * perPage;
            const endIndex = page * perPage;
            let com_id = '';
            if (req.user.data.type == 1) {
                com_id = req.user.data.idQLC
                let showLoai = await LoaiTaiSan.find({
                    id_cty: com_id
                })
                    .sort({ id_vitri: -1 })
                    .skip(startIndex)
                    .limit(perPage);
                return functions.success(res, 'get data success', { showLoai })
            }
            if (req.user.data.type == 2) {
                com_id = req.user.data.inForPerson.employee.com_id;
                let showLoai = await LoaiTaiSan.find({
                    id_cty: com_id
                })
                    .sort({ id_vitri: -1 })
                    .skip(startIndex)
                    .limit(perPage);
                return functions.success(res, 'get data success', { showLoai })
            } else {
                return functions.setError(res, 'không có quyền truy cập', 400)
            }
        } catch (error) {
            return functions.setError(res, error)
        }
    } catch (error) {
        return functions.setError(res, error)
    }
}

