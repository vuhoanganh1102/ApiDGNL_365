const De_Xuat = require('../../../models/Vanthu/de_xuat');

exports.edit_del_type = async (req, res) => {
    let id = req.params.id;
    console.log(id);
    let del_type = req.params.delType;
    console.log(del_type);
    if (!isNaN(id)) {
        let de_xuat = await De_Xuat.findOne({ _id: id });

        if (de_xuat) {
            await De_Xuat.findByIdAndUpdate({ _id: id }, {
                del_type: del_type
            });
            return res.status(200).json('update del_type thanh cong');
        } else {
            return res.status(200).json("doi tuong khong ton tai");
        }
    } else {
        return res.status(404).json("id phai la 1 so Number");
    }
}

exports.edit_active = async (req, res) => {
    let id = req.params.id;
    let active = req.params.active;
    let time_duyet = req.body.time_duyet;
    console.log(time_duyet);
    if (!isNaN(id)) {
        let de_xuat = await De_Xuat.findOne({ _id: id });
        if (de_xuat) {
            await De_Xuat.findByIdAndUpdate({ _id: id }, { active: active, time_duyet: time_duyet });

            return res.status(200).json('active thanh cong');
        } else {
            return res.status(200).json('de xuat khong ton tai');
        }
    } else {
        return res.status(404).json('id phai la 1 so Number');
    }
}