
const De_Xuat = require('../../../models/Vanthu/de_xuat');
const delete_Dx = require('../../../models/Vanthu/delete_dx');
const his_handle = require('../../../models/Vanthu/history_handling_dx');
const functions = require('../../../services/functions')

// hàm khi người dùng ấn hủy tiếp nhận hoặc từ chối
exports.delete_dx = async (req, res) => {
    try {
        let { id, type } = req.body;
        if (!id) {
            return functions.setError(res, 'Thông tin truyền lên không đầy đủ', 400);
        }
        let id_com = 0;
        if (req.user.data.type == 1) {
            id_com = req.user.data.idQLC
        } else if (req.user.data.type == 2) {
            id_com = req.user.data.inForPerson.employee.com_id
        } else {
            return functions.setError(res, 'không có quyền truy cập', 400);
        }
        if (type === 1) {
            await De_Xuat.deleteMany({ _id: { $in: id }, com_id: id_com });
            await delete_Dx.deleteMany({ id_dx_del: { $in: id }, user_del_com: id_com });
        }
        else if (type == 0) {
            // Kiểm tra và cập nhật trạng thái của đề xuất
            const deXuat = await De_Xuat.findOne({ _id: id });

            if (!deXuat) {
                return res.status(400).json({ message: 'Đề xuất không tồn tại!' });
            }

            deXuat.del_type = 2;
            await deXuat.save();

            const deleteDX = new delete_Dx({
                user_del: deXuat.id_user,
                user_del_com: id_com,
                id_dx_del: id,
                time_del: new Date()
            });
            await deleteDX.save();
            return res.status(200).json({ message: 'Đã cập nhật trạng thái của đề xuất thành công!' });
        }
        else if (type === 2) {
            // Khôi phục đề xuất
            await De_Xuat.updateMany({ _id: { $in: id }, del_type: 1 }, { del_type: 0 });
            await delete_Dx.deleteMany({ id_dx_del: { $in: id }, user_del_com: id_com });
      
            return res.status(200).json({ message: 'Bạn đã khôi phục đề xuất thành công!' });
          }
        
    } catch (error) {
        console.error('Failed to add delete', error);
        res.status(500).json({ error: 'Failed to add delete' });
    }

}


//hiển thị đề xuất đã xóa + tìm kiếm
exports.de_xuat_da_xoa_All = async (req, res) => {
    try {
        let {
            phong_ban,
            id_nhan_vien,
            loai_de_xuat,
            trang_thai_de_xuat } = req.body;
        let filter = {};
        if (phong_ban) { filter.phong_ban = phong_ban };

        if (id_nhan_vien) { filter.id_user = id_nhan_vien };
        if (loai_de_xuat) { filter.type_dx };
        if (trang_thai_de_xuat) { filter.type_duyet };
        let id_user_duyet = req.body.id_user_duyet;
        if (!isNaN(id_user_duyet)) {
            let de_xuat_da_xoa = [];
            let his_delete = await delete_Dx.find({ user_del: id_user_duyet });
            for (let i = 0; i < his_delete.length; i++) {
                filter._id = his_delete[i].id_dx_del;
                let de_xuat = await De_Xuat.findOne(filter);
                if (de_xuat.del_type == 2) {
                    let info_dx = {
                        id: de_xuat._id,
                        name_user: de_xuat.name_user,
                        name_dx: de_xuat.name_dx,
                        status: de_xuat.type_time,
                        time_del: his_delete.time_del
                    }
                    de_xuat_da_xoa.push(info_dx);
                }
            }
            return res.status(200).json({ data: de_xuat_da_xoa, message: "thanh cong " });

        } else {
            return res.status(404).json({ message: "bad request" });
        }
    } catch (error) {
        console.error('Failed to show ', error);
        res.status(500).json({ error: 'Failed to show ' });
    }
}


exports.khoi_phuc = async (req, res) => {
    try {

        let id = req.body.id;
        // console.log(typeof id);
        // return;
        if (id) {
            let list_id_dx = id.split(',');

            for (let i = 0; i < list_id_dx.length; i++) {
                await De_Xuat.findByIdAndUpdate({ _id: list_id_dx[i] }, { del_type: 1 });
                await delete_Dx.deleteMany({ id_dx_del: list_id_dx[i] });
            }
            return res.status(200).json({ message: 'success' });
        } else {
            return res.status(404).json({ message: 'bad request' });
        }
    } catch (error) {
        console.error('Failed  ', error);
        res.status(500).json({ error: 'Failed  ' });
    }

}




exports.xoa_vinh_vien = async (req, res) => {
    try {
        let _id = req.body.id;
        let id_user = req.user.data.idQLC;
        let de_xuat_da_xoa = [];
        if (!isNaN(_id)) {
            let list_id_dx = _id.split(",");
            for (let i = 0; i < list_id_dx.length; i++) {
                await delete_Dx.deleteOne({ id_dx_del: list_id_dx[i] });
            }
            let his_delete = await delete_Dx.find({ user_del: id_user });
            for (let i = 0; i < his_delete.length; i++) {
                let de_xuat = await De_Xuat.findOne({ _id: his_delete[i].id_dx_del });
                if (de_xuat.del_type == 2) {
                    let info_dx = {
                        id: de_xuat._id,
                        name_user: de_xuat.name_user,
                        name_dx: de_xuat.name_dx,
                        status: de_xuat.active,
                        time_del: his_delete.time_del
                    }
                    de_xuat_da_xoa.push(info_dx);
                }
                console.log(de_xuat_da_xoa);
            }
            return res.status(200).json({ data: de_xuat_da_xoa, message: 'success' });
        } else {
            return res.status(200).json({ message: 'bad request' });
        }
    } catch (error) {
        console.error('Failed to delete ', error);
        res.status(500).json({ error: 'Failed to delete  ' });
    }

}   