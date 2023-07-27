
const De_Xuat = require('../../../models/Vanthu/de_xuat');
const delete_Dx = require('../../../models/Vanthu/delete_dx');
const his_handle = require('../../../models/Vanthu/history_handling_dx');
const functions = require('../../../services/functions')
const User = require('../../../models/Users');

// hàm khi người dùng ấn hủy tiếp nhận hoặc từ chối và khôi phục
exports.delete_dx = async (req, res) => {
  try {
    let { id, type } = req.body;
    if (!id) {
      return functions.setError(res, 'Thông tin truyền lên không đầy đủ', 400);
    }
    let id_com = 0;
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      id_com = req.user.data.idQLC
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    if (type == 1) { // gửi về kiểu mảng / xóa vĩnh viễn đề 
      let idArraya = id.map(idItem => parseInt(idItem));
      await De_Xuat.deleteMany({ _id: { $in: idArraya }, com_id: id_com });
      await delete_Dx.deleteMany({
        id_dx_del: { $in: idArraya },
        user_del_com: id_com
      });
      return functions.success(res, 'xóa thành công!');
    }
    else if (type == 0) {
      // Kiểm tra và cập nhật trạng thái của đề xuất / thêm vào bảng xóa
      const deXuat = await De_Xuat.findOne({ _id: id });
      if (!deXuat) {
        return functions.setError(message, 'Đề xuất không tồn tại!', 400);
      }
      deXuat.del_type = 2;
      await deXuat.save();
      let deleteDX = new delete_Dx({
        _id: await functions.getMaxID(delete_Dx) + 1,
        user_del: deXuat.id_user,
        user_del_com: id_com,
        id_dx_del: id,
        time_del: new Date()
      });
      await deleteDX.save();
      return functions.success(res, 'Đã cập nhật trạng thái của đề xuất thành công!');
    }
    else if (type == 2) {
      // Khôi phục đề xuất 
      let idArray = id.map(idItem => parseInt(idItem));
      await De_Xuat.updateMany({
        _id: { $in: idArray },
        del_type: 1
      },
        { del_type: 0 });
      await delete_Dx.deleteMany({
        id_dx_del: { $in: idArray },
        user_del_com: id_com
      });
      return functions.success(res, 'Bạn đã khôi phục đề xuất thành công!');
    } else {
      return functions.setError(message, 'không thể thực thi!', 400);
    }
  } catch (error) {
    console.error('Failed ', error);
    return functions.setError(res, error);
  }
}

//hiển thị đề xuất đã xóa + tìm kiếm
exports.de_xuat_da_xoa_All = async (req, res) => {
  try {
    const {
      id_phong_ban,
      id_user,
      type_dx,
      time_start,
      time_end,
      page,
      pageSize
    } = req.body;
    let com_id = '';

    if (req.user.data.type == 1) {
      com_id = req.user.data.com_id;
      if (time_start && time_end && time_start > time_end) {
        return functions.setError(res, 'time_start phải nhỏ hơn time_end', 400);
      }
      const query = {
        com_id,
        del_type: 2,
      };
      // Bổ sung điều kiện tìm kiếm
      if (id_user) {
        query.id_user = id_user;
      }

      if (type_dx) {
        query.type_dx = type_dx;
      }

      if (time_start && time_end) {
        query.time_create = {
          $gte: new Date(time_start),
          $lte: new Date(time_end),
        };
      }
      const totalCount = await De_Xuat.countDocuments(query);
      const totalPages = Math.ceil(totalCount / pageSize);
      const listDeXuatCom = await De_Xuat.find(query)
        .skip((page - 1) * pageSize)
        .limit(pageSize);
      return functions.success(res, 'get data success', { listDeXuatCom, totalPages });
    } else if (req.user.data.type == 2) {
      com_id = req.user.data.com_id;
      // Kiểm tra điều kiện time_start và time_end
      if (time_start && time_end && time_start > time_end) {
        return functions.setError(res, 'time_start phải nhỏ hơn time_end', 400);
      }
      const query = {
        user_del: req.user.data.idQLC,
        del_type: 2,
      };
      // Bổ sung điều kiện tìm kiếm
      if (id_user) {
        query.id_user = id_user;
      }
      if (type_dx) {
        query.type_dx = type_dx;
      }
      if (time_start && time_end) {
        query.time_create = {
          $gte: new Date(time_start),
          $lte: new Date(time_end),
        };
      }
      const totalCount = await De_Xuat.countDocuments(query);
      const totalPages = Math.ceil(totalCount / pageSize);
      const listDeXuatUser = await De_Xuat.find(query)
        .populate('delete_dx')
        .skip((page - 1) * pageSize)
        .limit(pageSize);
      return functions.success(res, 'get data success', { listDeXuatUser, totalPages  });
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
  } catch (error) {
    console.error('Failed to show ', error);
    res.status(500).json({ error: 'Failed to show ' });
  }
};


