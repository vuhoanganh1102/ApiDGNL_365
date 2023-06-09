
const De_Xuat = require('../../../models/Vanthu/de_xuat');
const delete_Dx = require('../../../models/Vanthu/delete_dx');
const his_handle = require('../../../models/Vanthu/history_handling_dx');
exports.delete_dx = async (req, res) => {
    let id_use = req.body.id_user;
    console.log(id_use);
    let id = req.body.id;
    console.log("id la :  " + id);
    let de_xuat = [];
    if (!isNaN(id)) {

        de_xuat = await De_Xuat.findOne({ _id: id });

        if (!de_xuat) {
            return res.status(200).json("de xuat khong ton tai");
        } else {
            let maxID = 0;
            const dx = await delete_Dx.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
            console.log(dx);
            if (dx) {
                maxID = dx.id_del;
            }

            let del_dx = new delete_Dx({
                id_del: maxID + 1,
                user_del: id_use,
                user_del_com: de_xuat.com_id,
                id_dx_del: id,
                time_del: Date.now()

            });
            await del_dx.save();// lưu vao bang del_dx

            const max_hisHandle = await his_handle.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;

            if (max_hisHandle) {
                maxID = max_hisHandle.id_his;
            }
            let his_handel_duyet = await new his_handle({
                id_his: maxID + 1,
                id_dx: id,
                id_user: id_user,
                type_handling: 3,//2- đồng ý // 3- hủy duyệt //1-xác nhận
                time: new Date()
            });
            await his_handel_duyet.save()// lưu trạng thái xử lí vào bảng his_handle;

            console.log(del_dx);
            await De_Xuat.findOneAndUpdate({ _id: id }, { del_type: 2, active: 2, delete_Dx: Date.now(), type_duyet: 3 });
            return res.status(200).json({ data: del_dx, message: 'xoa thanh cong ' });
        }
    } else {
        return res.status(404).json("id phai la 1 so Number");
    }


}

exports.de_xuat_da_xoa_All = async (req, res) => {
    let id_user = req.body.id_user;
    if (!isNaN(id_user)) {
        let de_xuat_da_xoa = [];


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

        }
        return res.status(200).json({ data: de_xuat_da_xoa, message: "thanh cong " });

    } else {
        return res.status(404).json({ message: "bad request" });

    }

}
exports.khoi_phuc = async (req, res) => {
    let id = req.body.id;
    if (!isNaN(id)) {
        let list_id_dx = id.split(',');

        for (let i = 0; i < list_id_dx.length; i++) {
            await De_Xuat.findByIdAndUpdate({ _id: list_id_dx[i] }, { active: 1 });
        }

        return res.status(200).json({ message: 'success' });
    } else {
        return res.status(200).json({ message: 'bad request' });
    }

}

exports.xoa_vinh_vien = async (req, res) => {

    let _id = req.body.id;
    let id_user = req.body.id_user;
    if (!isNaN(_id)) {
        let list_id_dx = _id.split(",");
        console.log(list_id_dx.length);

        for (let i = 0; i < list_id_dx.length; i++) {
            await delete_Dx.deleteOne({ id_dx_del: list_id_dx[i] });
        }


        let his_delete = await delete_Dx.find({ user_del: id_user });


        let de_xuat_da_xoa = [];
        console.log(de_xuat_da_xoa);
        for (let i = 0; i < his_delete.length; i++) {
            let de_xuat = await De_Xuat.findOne({ _id: his_delete[i].id_dx_del });
            console.log(his_delete[i].id_dx_del);
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

        }

        return res.status(200).json({ data: de_xuat_da_xoa, message: 'success' });
    } else {
        return res.status(200).json({ message: 'bad request' });
    }
}   