const De_Xuat = require('../../../models/Vanthu/de_xuat');
const setting_dx = require('../../../models/Vanthu365/setting_dx');
const his_handle = require('../../../models/Vanthu/history_handling_dx');


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
    let id = req.body._id;// id đề xuất 
    let active = req.body.active;
    let id_user = req.body.id_user;//id nguoi duyet 
    let type_duyet = req.body.type_duyet;
    let danh_sach_nguoi_duyet = [];
    let type_handling = req.body.type_handling;
    if (!isNaN(id) && !isNaN(active)) {

        let de_xuat = await De_Xuat.findOne({ _id: id });
        // console.log("de_xuat: " + de_xuat);

        //lấy hạn duyệt 
        let han_duyet = 0;
        let com_id = de_xuat.com_id;//1761
        let type_setting = de_xuat.type_time;// đề xuất có kế hoạch hoặc không //0
        let typeBrowse = de_xuat.kieu_duyet;// có 2 người duyệt trở lên //1
        let type_dx = de_xuat.type_dx;
        // console.log("type_dx  : " + type_dx);

        if (type_dx == 19) {// dề xuất thưởng phạt
            let Setting_dx = await setting_dx.findOne({ ComId: com_id, typeSetting: type_setting, typeBrowse: typeBrowse });
            han_duyet = Setting_dx.timeTP;
            //console.log("time thuong phat : " + han_duyet);
        }
        else if (type_dx == 20) {// thưởng doanh thu 
            let Setting_dx = await setting_dx.findOne({ ComId: com_id, typeSetting: type_setting, typeBrowse: typeBrowse });
            han_duyet = Setting_dx.timeHH;
            // console.log("time hoa hong  : " + han_duyet);

        } else {
            let Setting_dx = await setting_dx.findOne({ ComId: com_id, typeSetting: type_setting, typeBrowse: typeBrowse });
            //console.log(Setting_dx);
            han_duyet = Setting_dx.timeLimit;
            //console.log("time duyet  : " + han_duyet);
        }


        // 1 trong số danh sach nguoi duyet bam duyet 
        let maxID = 0;
        const max_hisHandle = await his_handle.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;

        if (max_hisHandle) {
            maxID = max_hisHandle.id_his;
        }
        let his_handel_duyet = await new his_handle({
            id_his: maxID + 1,
            id_dx: id,
            id_user: id_user,
            type_handling: type_handling,//2- đồng ý // 3- hủy duyệt 
            time: new Date()
        });

        await his_handel_duyet.save();

        //trường hợp 2 người duyệt trở lên 
        let so_nguoi_duyet = 0;
        let check_dong_y = 0;
        let check_tu_choi = 0;

        let his_handle_dx = await his_handle.find({ id_dx: id });
        console.log(his_handle_dx);
        danh_sach_nguoi_duyet = de_xuat.id_user_duyet.split(",");
        for (let i = 0; i < danh_sach_nguoi_duyet.length; i++) {
            for (let j = 0; j < his_handle_dx.length; j++) {
                if (his_handle_dx[j].id_user == danh_sach_nguoi_duyet[i]) {
                    so_nguoi_duyet += 1;

                };
                if (his_handle_dx[j].id_user == 2) {
                    check_dong_y += 1;
                } else if (his_handle_dx[j].id_user == 3) {
                    check_tu_choi += 1;
                }





            }
        }
        if (c == danh_sach_nguoi_duyet.length) {
            if (check_dong_y == danh_sach_nguoi_duyet.length) {
                await De_Xuat.findByIdAndUpdate({ _id: id }, { time_duyet: new Date(), active: 1, type_duyet: 5 });//1- đồng ý 


            } else if (check_dong_y + check_tu_choi == danh_sach_nguoi_duyet.length) {
                await De_Xuat.findByIdAndUpdate({ _id: id }, { time_duyet: new Date(), active: 2, type_duyet: type_duyet });//1- đồng ý 

            } else {
                await De_Xuat.findByIdAndUpdate({ _id: id }, { time_duyet: new Date(), active: 0, type_duyet: 7 });//1- đồng ý 
            }
        }




        await De_Xuat.findByIdAndUpdate({ _id: id }, { active: active, time_duyet: new Date() });

        return res.status(200).json('active thanh cong');

    } else {
        return res.status(404).json('bad request');
    }
}

exports.edit_tiep_nhan = async (req, res) => {

    let id = req.body._id;// id đề xuất 
    let id_user = req.body.id_user;//id nguoi duyet 
    let de_xuat = await De_Xuat.findOne({ _id: id });
    console.log("de_xuat: " + de_xuat);
    //lấy hạn duyệt 
    let han_duyet = 0;
    let com_id = de_xuat.com_id;//1761
    let type_setting = de_xuat.type_time;// đề xuất có kế hoạch hoặc không //0
    let typeBrowse = de_xuat.kieu_duyet;// có 2 người duyệt trở lên //1
    let type_dx = de_xuat.type_dx;
    console.log("type_dx  : " + type_dx);

    if (type_dx == 19) {// dề xuất thưởng phạt
        let Setting_dx = await setting_dx.findOne({ ComId: com_id, typeSetting: type_setting, typeBrowse: typeBrowse });
        han_duyet = Setting_dx.timeTP;
        console.log("time thuong phat : " + han_duyet);
    }
    else if (type_dx == 20) {// thưởng doanh thu 
        let Setting_dx = await setting_dx.findOne({ ComId: com_id, typeSetting: type_setting, typeBrowse: typeBrowse });
        han_duyet = Setting_dx.timeHH;
        console.log("time hoa hong  : " + han_duyet);

    } else {
        let Setting_dx = await setting_dx.findOne({ ComId: com_id, typeSetting: type_setting, typeBrowse: typeBrowse });
        console.log(Setting_dx);
        han_duyet = Setting_dx.timeLimit;
        console.log("time duyet  : " + han_duyet);
    }


    //kiem tra han duyet ==> thời gian tạo đề xuất cộng thời gian han_duyet < new Date().getTime() ==> hết hạn duyệt



    let het_han_duyet = false;

    console.log("time create: " + de_xuat.time_create.getTime());
    console.log("now time: " + new Date().getTime());
    console.log("han duyet : " + (new Date().getTime() - parseInt(de_xuat.time_create.getTime() + (han_duyet * 3600 / 1000))));
    if (new Date().getTime() - parseInt(de_xuat.time_create.getTime() + (han_duyet * 3600 / 1000)) > 0) {
        console.log('heet han')
        het_han_duyet = true;

    }

    //console.log(het_han_duyet);

    if (het_han_duyet) {
        return res.json({ message: " het han duyet " });
    } else {// cập nhật trạng tái  đã nhận dề xuất 
        await De_Xuat.findByIdAndUpdate({ _id: id }, { type_duyet: 7, time_tiep_nhan: new Date().getTime() });// cập nhật thời gian tiếp nhận và cập nhật type_duyet
        let maxID = 0;
        const max_hisHandle = await his_handle.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;

        if (max_hisHandle) {
            maxID = max_hisHandle.id_his;
        }
        // lưu vào history_handle
        let hisHandle = new his_handle({
            id_his: maxID + 1,
            id_dx: id,
            id_user: id_user,
            type_handling: 1,
            time: new Date()
        });
        await hisHandle.save();

    }

    return res.status(200).json("thanh cong");
















}