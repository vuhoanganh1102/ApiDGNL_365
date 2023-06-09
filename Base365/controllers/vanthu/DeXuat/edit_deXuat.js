const De_Xuat = require('../../../models/Vanthu/de_xuat');
const setting_dx = require('../../../models/Vanthu365/setting_dx');
const his_handle = require('../../../models/Vanthu/history_handling_dx');


exports.edit_del_type = async (req, res) => {
    let id = req.body.id;
    console.log(id);
    let del_type = req.body.delType;

    let page = Number(req.body.page) ? Number(req.body.page) : 1;
    let pageSize = Number(req.body.pageSize) ? Number(req.body.pageSize) : 10;
    const skip = (page - 1) * pageSize;

    console.log(del_type);
    if (!isNaN(id)) {
        let de_xuat = await De_Xuat.findOne({ _id: id }).skip(skip).limit(pageSize);

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
    let id = Number(req.body._id);// id đề xuất 
    let page = Number(req.body.page) ? Number(req.body.page) : 1;
    let pageSize = Number(req.body.pageSize) ? Number(req.body.pageSize) : 10;
    const skip = (page - 1) * pageSize;

    let id_user = Number(req.body.id_user);//id nguoi duyet 
    console.log("id_user" + id_user);
    let type_duyet = Number(req.body.type_duyet);
    let danh_sach_nguoi_duyet = [];
    let type_handling = Number(req.body.type_handling);//1 -tiếp nhận 2-duyệt 3-từ chối 
    if (!isNaN(id) && !isNaN(type_duyet) && !isNaN(type_handling) && !isNaN(id_user)) {

        let de_xuat = await De_Xuat.findOne({ _id: id }).skip(skip).limit(pageSize);
        danh_sach_nguoi_duyet = de_xuat.id_user_duyet.split(",");//danh sách những người duyệt 
        // console.log("de_xuat: " + de_xuat);

        //lấy hạn duyệt 
        let han_duyet = 0;
        let com_id = de_xuat.com_id;//1761
        let type_setting = de_xuat.type_time;// đề xuất có kế hoạch hoặc không //0
        let typeBrowse = de_xuat.kieu_duyet;// có 2 người duyệt trở lên //1
        let type_dx = de_xuat.type_dx;

        if (type_dx == 19) {// dề xuất thưởng phạt
            let Setting_dx = await setting_dx.findOne({ ComId: com_id, typeSetting: type_setting, typeBrowse: typeBrowse });
            han_duyet = Setting_dx.timeTP;

        }
        else if (type_dx == 20) {// thưởng doanh thu 
            let Setting_dx = await setting_dx.findOne({ ComId: com_id, typeSetting: type_setting, typeBrowse: typeBrowse });
            han_duyet = Setting_dx.timeHH;

        } else {
            let Setting_dx = await setting_dx.findOne({ ComId: com_id, typeSetting: type_setting, typeBrowse: typeBrowse });
            han_duyet = Setting_dx.timeLimit;
        }

        //kiểm tra hạn duyệt 
        let het_han_duyet = false;
        if (new Date().getTime() - parseInt(de_xuat.time_create.getTime() + (han_duyet * 3600 / 1000)) > 0) {
            console.log('heet han')
            het_han_duyet = true;
        }


        if (het_han_duyet) {
            return res.status(200).json({ message: "de xuat da het han duyet " });
        } else {
            // 1 trong số danh sach nguoi duyet bam duyet , từ chối , tiếp nhận 
            let maxID = 0;
            const max_hisHandle = await his_handle.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;

            if (max_hisHandle) {
                maxID = max_hisHandle.id_his;
            }
            let his_handel_duyet = await new his_handle({
                id_his: maxID + 1,
                id_dx: id,
                id_user: id_user,
                type_handling: type_handling,//2- đồng ý // 3- hủy duyệt //1-xác nhận
                time: new Date()
            });

            await his_handel_duyet.save()// lưu trạng thái xử lí vào bảng handle;





            //trường hợp 2 người duyệt trở lên 

            let his_handle_dx = await his_handle.find({ id_dx: id });//lấy lịch sử xử lí của đễ xuất đó

            // console.log("his:" + his_handle_dx);

            console.log("danh_sach_nguoi_duyet:" + danh_sach_nguoi_duyet.length);
            console.log("his_handle_dx:" + his_handle_dx[0]);


            let check_tiep_nhan = 0;
            let check_dong_y = 0;
            let check_tu_choi = 0;

            for (let i = 0; i < danh_sach_nguoi_duyet.length; i++) {
                for (let j = 0; j < his_handle_dx.length; j++) {
                    if (his_handle_dx[j].id_user == danh_sach_nguoi_duyet[i] && his_handle_dx[j].type_handling == 2) {

                        // console.log(2);
                        check_dong_y += 1;

                    };
                    if (his_handle_dx[j].id_user == danh_sach_nguoi_duyet[i] && his_handle_dx[j].type_handling == 3) {
                        // console.log(3);
                        check_tu_choi += 1;

                    };
                    if (his_handle_dx[j].id_user == danh_sach_nguoi_duyet[i] && his_handle_dx[j].type_handling == 1) {

                        //console.log(1);
                        check_tiep_nhan += 1;

                    };
                }

            }
            console.log("check_tiep_nhan" + check_tiep_nhan);
            console.log("check_tu_choi" + check_tu_choi);
            console.log("check_dong_y" + check_dong_y);
            console.log("danh_sach_nguoi_duyet:" + danh_sach_nguoi_duyet.length);
            if (check_dong_y == danh_sach_nguoi_duyet.length) {//tất cả người duyệt đều đông ý 
                console.log("dong y")
                let update_dx = await De_Xuat.findOneAndUpdate({ _id: id }, { active: 1, time_duyet: new Date(), type_duyet: 5 });

                return res.status(200).json({ data: update_dx, message: "update dhuyetg " });

            }
            if (check_tu_choi != 0) {// trên 1 người từ chối thì dx bị từ chối 
                console.log("tu choi ")

                let update_dx = await De_Xuat.findOneAndUpdate({ _id: id }, { active: 2, time_duyet: new Date(), type_duyet: type_duyet });

                return res.status(200).json({ data: update_dx, message: "update thanh cong " });

            }
            if (check_tiep_nhan > 0 && check_tu_choi == 0 && check_dong_y != danh_sach_nguoi_duyet.length) {
                console.log("xet duyet ")
                let update_dx = await De_Xuat.findOneAndUpdate({ _id: id }, { active: 0, time_tiep_nhan: new Date(), type_duyet: 7 });

                return res.status(200).json({ data: update_dx, message: "update thanh cong " });

            }

        }


    } else {
        return res.status(404).json('bad request');

    }

}
// exports.edit_tiep_nhan = async (req, res) => {

//     let id = req.body._id;// id đề xuất
//     let id_user = req.body.id_user;//id nguoi duyet
//     let de_xuat = await De_Xuat.findOne({ _id: id });
//     console.log("de_xuat: " + de_xuat);
//     //lấy hạn duyệt
//     let han_duyet = 0;
//     let com_id = de_xuat.com_id;//1761
//     let type_setting = de_xuat.type_time;// đề xuất có kế hoạch hoặc không //0
//     let typeBrowse = de_xuat.kieu_duyet;// có 2 người duyệt trở lên //1
//     let type_dx = de_xuat.type_dx;
//     console.log("type_dx  : " + type_dx);

//     if (type_dx == 19) {// dề xuất thưởng phạt
//         let Setting_dx = await setting_dx.findOne({ ComId: com_id, typeSetting: type_setting, typeBrowse: typeBrowse });
//         han_duyet = Setting_dx.timeTP;
//         console.log("time thuong phat : " + han_duyet);
//     }
//     else if (type_dx == 20) {// thưởng doanh thu
//         let Setting_dx = await setting_dx.findOne({ ComId: com_id, typeSetting: type_setting, typeBrowse: typeBrowse });
//         han_duyet = Setting_dx.timeHH;
//         console.log("time hoa hong  : " + han_duyet);

//     } else {
//         let Setting_dx = await setting_dx.findOne({ ComId: com_id, typeSetting: type_setting, typeBrowse: typeBrowse });
//         console.log(Setting_dx);
//         han_duyet = Setting_dx.timeLimit;
//         console.log("time duyet  : " + han_duyet);
//     }


//     //kiem tra han duyet ==> thời gian tạo đề xuất cộng thời gian han_duyet < new Date().getTime() ==> hết hạn duyệt



//     let het_han_duyet = false;

//     console.log("time create: " + de_xuat.time_create.getTime());
//     console.log("now time: " + new Date().getTime());
//     console.log("han duyet : " + (new Date().getTime() - parseInt(de_xuat.time_create.getTime() + (han_duyet * 3600 / 1000))));
//     if (new Date().getTime() - parseInt(de_xuat.time_create.getTime() + (han_duyet * 3600 / 1000)) > 0) {
//         console.log('heet han')
//         het_han_duyet = true;

//     }

//     //console.log(het_han_duyet);

//     if (het_han_duyet) {
//         return res.json({ message: " het han duyet " });
//     } else {// cập nhật trạng tái  đã nhận dề xuất
//         await De_Xuat.findByIdAndUpdate({ _id: id }, { type_duyet: 7, time_tiep_nhan: new Date().getTime() });// cập nhật thời gian tiếp nhận và cập nhật type_duyet
//         let maxID = 0;
//         const max_hisHandle = await his_handle.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;

//         if (max_hisHandle) {
//             maxID = max_hisHandle.id_his;
//         }
//         // lưu vào history_handle
//         let hisHandle = new his_handle({
//             id_his: maxID + 1,
//             id_dx: id,
//             id_user: id_user,
//             type_handling: 1,
//             time: new Date()
//         });
//         await hisHandle.save();

//     }

//     return res.status(200).json("thanh cong");

// }