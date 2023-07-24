const fnc = require('../../../services/functions');
const ThongBao = require('../../../models/QuanLyTaiSan/ThongBao');
const BaoDuong = require('../../../models/QuanLyTaiSan/BaoDuong');
const QuyDinh = require('../../../models/QuanLyTaiSan/Quydinh_bd');
const TheoDoiCongSuat = require('../../../models/QuanLyTaiSan/TheoDoiCongSuat');
const LoaiTaiSan = require('../../../models/QuanLyTaiSan/LoaiTaiSan');


//lay ra danh sach can bao duong/ dang bao duong/ da bao duong/ quy dinh bao duong/ theo doi cong suat

exports.xoaBaoDuong = async (req, res) => {
  try {
    let { id, type } = req.body;
    if (!id) {
      return fnc.setError(res, 'Thông tin truyền lên không đầy đủ', 400);
    }
    let id_com = 0;
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      id_com = req.user.data.com_id;
    } else {
      return fnc.setError(res, 'không có quyền truy cập', 400);
    }
    if (type == 1) { // xóa vĩnh viễn
      let idArraya = id.map(idItem => parseInt(idItem));
      await BaoDuong.deleteMany({ id_bd: { $in: idArraya }, id_cty: id_com });
      return fnc.success(res, 'xóa thành công!');
    } else if (type == 0) {
      // thay đổi trạng thái là 1
      let idArray = id.map(idItem => parseInt(idItem));
      await BaoDuong.updateMany(
        { id_bd: { $in: idArray }, xoa_bd: 0 },
        { xoa_bd: 1 }
      );
      return fnc.success(res, 'Bạn đã xóa thành công vào danh sách dã xóa !');
    } else if (type == 2) {
      // Khôi phục bảo dưỡng
      let idArray = id.map(idItem => parseInt(idItem));
      await BaoDuong.updateMany(
        { id_bd: { $in: idArray }, xoa_bd: 1 },
        { xoa_bd: 0 }
      );
      return fnc.success(res, 'Bạn đã khôi phục bảo dưỡng thành công!');
    } else {
      return fnc.setError(res, 'không thể thực thi!', 400);
    }
  } catch (e) {
    return fnc.setError(res, e.message);
  }
};

