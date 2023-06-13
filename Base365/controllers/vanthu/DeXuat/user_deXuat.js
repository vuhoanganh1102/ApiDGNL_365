
const De_Xuat = require('../../../models/Vanthu/de_xuat');
const cate_de_xuat = require('../../../models/Vanthu/cate_de_xuat');
const settingdx = require('../../../models/Vanthu365/setting_dx');
//onst setting_dx = require('../../../models/Vanthu365/setting_dx');
let info_de_xuat_All = [];
let info_de_xuat_cho_duyet = [];
let info_de_xuat_da_duyet = [];
let info_de_xuat_da_tu_choi = [];
let de_Xuat = [];
let het_han_duyet = [];

// đề xuất tôi gửi đi 
exports.deXuat_user_send = async (req, res) => {

    let id_user = req.body.id_user;
    // console.log(typeof (id_user));
    let nguoi_nhan_de_xuat = req.body.id_user_duyet ? req.body.id_user_duyet : 0;
    let danh_sach_nguoi_nhan = [];

    console.log(typeof (nguoi_nhan_de_xuat));

    if (nguoi_nhan_de_xuat != 0) {
        danh_sach_nguoi_nhan = nguoi_nhan_de_xuat.split(",");
    }
    for (let i = 0; i < danh_sach_nguoi_nhan.length; i++) {
        console.log("phan tu thu " + i + " : " + danh_sach_nguoi_nhan[i])
    }

    let time_send_from = req.body.time_send_from ? req.body.time_send_from : new Date('1970-01-01').getTime();

    let time_send_to = req.body.time_send_to ? req.body.time_send_to : new Date().getTime();

    if (id_user) {
        if (!isNaN(id_user)) {

            info_de_xuat_All = [];
            info_de_xuat_cho_duyet = [];
            info_de_xuat_da_duyet = [];
            info_de_xuat_da_tu_choi = [];
            de_Xuat = [];

            de_Xuat = await De_Xuat.find({ id_user: id_user });
            console.log(de_Xuat);
            if (de_Xuat) {

                for (let i = 0; i < de_Xuat.length; i++) {
                    let de_xuat = {
                        _id: de_Xuat[i]._id,
                        name_use: de_Xuat[i].name_user,
                        name_dx: de_Xuat[i].name_dx,
                        // type_duyet: item.type_duyet,//3- huy 5-duyệt 6 -bắt buộc đi làm 7- đã tiếp nhận
                        active: de_Xuat[i].active,//đòng ý hoặc từ chối 
                        time_create: de_Xuat[i].time_create,
                    }
                    if (nguoi_nhan_de_xuat === 0) {
                        if (de_Xuat[i].time_create >= time_send_from && de_Xuat[i].time_create <= time_send_to) {
                            // console.log("nguoi nhan rong ")
                            info_de_xuat_All.push(de_xuat);
                            // console.log("de xuat_all : " + info_de_xuat_All);
                        }
                    } else {

                        if (de_Xuat[i].time_create >= time_send_from && de_Xuat[i].time_create <= time_send_to && de_Xuat[i].id_user_duyet == nguoi_nhan_de_xuat) {
                            info_de_xuat_All.push(de_xuat);
                        }
                    }
                }
                for (let i = 0; i < info_de_xuat_All.length; i++) {
                    //theo model cũ trong mysql 1- là bên thứ 3 đòng ý 2- là bên thứ 3 không đồng ý 
                    if (info_de_xuat_All[i].active == 0) {
                        info_de_xuat_cho_duyet.push(info_de_xuat_All[i]);
                    }
                    if (info_de_xuat_All[i].active == 1) {
                        info_de_xuat_da_duyet.push(info_de_xuat_All[i]);
                    }

                    if (info_de_xuat_All[i].active == 2) {
                        info_de_xuat_da_tu_choi.push(info_de_xuat_All[i]);
                    }
                }
                return res.status(200).json({ data: info_de_xuat_All, message: 'thanh cong ' });
            } else {
                return res.status(200).json({ message: " khong co de xuat nao cho user " });
            }
        } else {
            return res.status(200).json({ message: "id_user have to a Number" })
        }
        //   return res.status(200).json({ message: 'thanh cong ' });
    } else {
        return res.status(404).json('bad request');
    }




}
//đđề xuất tôi gửi đi đang chờ duyệt active = 0 
exports.deXuat_userSend_cho_duyet = async (req, res) => {
    if (info_de_xuat_cho_duyet.length > 0) {
        return res.status(200).json({ data: info_de_xuat_cho_duyet, message: 'thanh cong ' });
    } else {
        return res.status(200).json({ message: 'khong co de xuat nao cho duyet' });
    }
}
//đề xuất tôi gửi đi đã được duyệt active  = 1 
exports.deXuat_userSend_da_duyet = async (req, res) => {
    if (info_de_xuat_da_duyet.length > 0) {

        return res.status(200).json({ data: info_de_xuat_da_duyet, message: 'thanh cong ' });
    } else {
        return res.status(200).json({ massage: 'khong co de xuat nao da duyet ' });
    }
}
//đề xuất tôi gửi đi đã được từ chối active = 2
exports.deXuat_userSend_da_tu_choi = async (req, res) => {
    if (info_de_xuat_da_tu_choi.length > 0) {
        return res.status(200).json({ data: info_de_xuat_da_tu_choi, message: 'thanh cong ' });
    } else {
        return res.status(200).json({ massage: 'khong co de xuat nao da tu choi ' });
    }
}



//đề xuất gửi đến tôi 
exports.de_xuat_send_to_me = async (req, res) => {
    let id_user_duyet = req.body.id_user_duyet;
    let id_user = req.body.id_user ? req.body.id_user : 0;
    let time_send_from = req.body.time_send_from ? req.body.time_send_from : new Date('1970-01-01').getTime();
    let time_send_to = req.body.time_send_to ? req.body.time_send_to : new Date().getTime();
    let tieu_de_de_xuat = req.body.tieu_de_de_xuat;
    let loai_de_xuat = req.body.loai_de_xuat;

    let filter = {};

    if (loai_de_xuat) { filter.type_dx = loai_de_xuat };
    if (id_user) { filter.id_user = id_user; }
    filter.id_user_duyet = id_user_duyet;
    let page = Number(req.body.page) ? Number(req.body.page) : 1;
    let pageSize = Number(req.body.pageSize) ? Number(req.body.pageSize) : 10;
    const skip = (page - 1) * pageSize;

    if (!isNaN(id_user_duyet)) {


        info_de_xuat_All = [];
        info_de_xuat_cho_duyet = [];
        info_de_xuat_da_duyet = [];
        info_de_xuat_da_tu_choi = [];
        de_Xuat = [];

        de_Xuat = await De_Xuat.find(filter).skip(skip).limit(pageSize);
        console.log(de_Xuat);
        if (de_Xuat) {

            for (let i = 0; i < de_Xuat.length; i++) {
                if (tieu_de_de_xuat) {
                    if (de_Xuat[i].name_dx.includes(tieu_de_de_xuat)) {
                        let de_xuat = {
                            _id: de_Xuat[i]._id,
                            name_use: de_Xuat[i].name_user,
                            name_dx: de_Xuat[i].name_dx,
                            type_duyet: de_Xuat[i].type_duyet,//3- huy 5-duyệt 6 -bắt buộc đi làm 7- đã tiếp nhận
                            active: de_Xuat[i].active,//đòng ý hoặc từ chối 
                            time_create: de_Xuat[i].time_create,
                        }

                        if (de_Xuat[i].time_create >= time_send_from && de_Xuat[i].time_create <= time_send_to && de_Xuat[i].del_type == 1) {
                            info_de_xuat_All.push(de_xuat);
                        }
                    }
                } else {
                    let de_xuat = {
                        _id: de_Xuat[i]._id,
                        name_use: de_Xuat[i].name_user,
                        name_dx: de_Xuat[i].name_dx,
                        type_duyet: de_Xuat[i].type_duyet,//3- huy 5-duyệt 6 -bắt buộc đi làm 7- đã tiếp nhận
                        active: de_Xuat[i].active,//đòng ý hoặc từ chối 
                        time_create: de_Xuat[i].time_create,
                    }

                    if (de_Xuat[i].time_create >= time_send_from && de_Xuat[i].time_create <= time_send_to && de_Xuat[i].del_type == 1) {
                        info_de_xuat_All.push(de_xuat);
                    }

                }
            }
            for (let i = 0; i < info_de_xuat_All.length; i++) {
                //theo model cũ trong mysql 1- là bên thứ 3 đòng ý 2- là bên thứ 3 không đồng ý 
                if (info_de_xuat_All[i].active == 0) {
                    info_de_xuat_cho_duyet.push(info_de_xuat_All[i]);
                }
                if (info_de_xuat_All[i].active == 1) {
                    info_de_xuat_da_duyet.push(info_de_xuat_All[i]);
                }

                if (info_de_xuat_All[i].active == 2) {
                    info_de_xuat_da_tu_choi.push(info_de_xuat_All[i]);
                }
            }
            return res.status(200).json({ data: info_de_xuat_All, message: 'thanh cong ' });
        } else {
            return res.status(200).json({ message: " khong co de xuat nao cho user " });
        }


    } else {
        return res.status(404).json('bad request');
    }
}
//đđề xuất gửi đến tôi đang chờ duyệt active = 0 
exports.deXuat_sendToMe_cho_duyet = async (req, res) => {
    if (info_de_xuat_cho_duyet.length > 0) {
        return res.status(200).json({ data: info_de_xuat_cho_duyet, message: 'thanh cong ' });
    } else {
        return res.status(200).json({ message: 'khong co de xuat nao cho duyet' });
    }
}
//đề xuất gửi đến tôi đã được duyệt active  = 1 
exports.deXuat_SendToMe_da_duyet = async (req, res) => {
    if (info_de_xuat_da_duyet.length > 0) {
        return res.status(200).json({ data: info_de_xuat_da_duyet, message: 'thanh cong ' });
    } else {
        return res.status(200).json({ massage: 'khong co de xuat nao da duyet ' });
    }
}
//đề xuất gửi đến tôi đã được từ chối active = 2
exports.deXuat_SendToMe_da_tu_choi = async (req, res) => {
    if (info_de_xuat_da_tu_choi.length > 0) {
        return res.status(200).json({ data: info_de_xuat_da_tu_choi, message: 'thanh cong ' });
    } else {
        return res.status(200).json({ massage: 'khong co de xuat nao da tu choi ' });
    }
}





//đề xuất tôi là người theo dõi 
exports.de_xuat_theo_doi = async (req, res) => {
    let id_user_theo_doi = req.body.id_user_theo_doi;

    let page = Number(req.body.page) ? Number(req.body.page) : 1;
    let pageSize = Number(req.body.pageSize) ? Number(req.body.pageSize) : 10;
    const skip = (page - 1) * pageSize;
    const setting_Dx = await settingdx.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
    console.log("serttting dx: " + setting_Dx);





    console.log(id_user_theo_doi);


    if (!isNaN(id_user_theo_doi)) {

        info_de_xuat_All = [];
        info_de_xuat_cho_duyet = [];
        info_de_xuat_da_duyet = [];
        info_de_xuat_da_tu_choi = [];
        de_Xuat = [];

        de_Xuat = await De_Xuat.find({ id_user_theo_doi: id_user_theo_doi }).skip(skip).limit(pageSize);

        if (de_Xuat) {

            for (let i = 0; i < de_Xuat.length; i++) {
                let de_xuat = {
                    _id: de_Xuat[i]._id,
                    name_use: de_Xuat[i].name_user,
                    name_dx: de_Xuat[i].name_dx,
                    type_dx: de_Xuat[i].type_dx,
                    type_duyet: de_Xuat[i].type_duyet,//3- huy 5-duyệt 6 -bắt buộc đi làm 7- đã tiếp nhận
                    active: de_Xuat[i].active,//đòng ý hoặc từ chối 
                    time_create: de_Xuat[i].time_create,
                    com_id: de_Xuat[i].com_id,
                    type_time: de_Xuat[i].type_time,
                    kieu_duyet: de_Xuat[i].kieu_duyet



                }

                info_de_xuat_All.push(de_xuat);

            }
            for (let i = 0; i < info_de_xuat_All.length; i++) {
                //theo model cũ trong mysql 1- là bên thứ 3 đòng ý 2- là bên thứ 3 không đồng ý 
                if (info_de_xuat_All[i].active == 0) {
                    info_de_xuat_cho_duyet.push(info_de_xuat_All[i]);
                }
                if (info_de_xuat_All[i].active == 1) {
                    info_de_xuat_da_duyet.push(info_de_xuat_All[i]);
                }

                if (info_de_xuat_All[i].active == 2) {
                    info_de_xuat_da_tu_choi.push(info_de_xuat_All[i]);
                }

                let han_duyet = 0;
                let com_id = info_de_xuat_All[i].com_id;//1761
                let type_setting = info_de_xuat_All[i].type_time;// đề xuất có kế hoạch hoặc không //0
                let typeBrowse = info_de_xuat_All[i].kieu_duyet;// có 2 người duyệt trở lên //1
                let type_dx = info_de_xuat_All[i].type_dx;

                if (type_dx == 19) {// dề xuất thưởng phạt
                    let Setting_dx = await settingdx.findOne({ ComId: com_id, typeSetting: type_setting, typeBrowse: typeBrowse });
                    han_duyet = Setting_dx.timeTP;

                }
                else if (type_dx == 20) {// thưởng doanh thu 
                    let Setting_dx = await settingdx.findOne({ ComId: com_id, typeSetting: type_setting, typeBrowse: typeBrowse });
                    han_duyet = Setting_dx.timeHH;
                    console.log(Setting_dx);

                } else {
                    let Setting_dx = await settingdx.findOne({ ComId: com_id, typeSetting: type_setting, typeBrowse: typeBrowse });
                    han_duyet = Setting_dx.timeLimit;
                    console.log(Setting_dx);
                }
                let time_han_duyet = (setting_Dx.timeLimit * 60 * 60) / 1000;
                console.log(han_duyet);


                if (info_de_xuat_All[i].time_create + time_han_duyet < new Date().getTime()) {
                    het_han_duyet.push(info_de_xuat_All[i]);
                }


            }
            return res.status(200).json({ data: info_de_xuat_All, message: 'thanh cong ' });
        } else {
            return res.status(200).json({ message: " khong co de xuat nao cho user " });
        }
    } else {
        return res.status(200).json({ message: "id_user have to a Number" })
    }


}

//đđề xuất tôi dang thoe dõi  đang chờ duyệt active = 0 
exports.deXuat_Follow_cho_duyet = async (req, res) => {
    if (info_de_xuat_cho_duyet.length > 0) {
        return res.status(200).json({ data: info_de_xuat_cho_duyet, message: 'thanh cong ' });
    } else {
        return res.status(200).json({ message: 'khong co de xuat nao cho duyet' });
    }
}
//đề xuất đang thoe dõi đã được duyệt active  = 1 
exports.deXuat_Follow_da_duyet = async (req, res) => {
    if (info_de_xuat_da_duyet.length > 0) {
        return res.status(200).json({ data: info_de_xuat_da_duyet, message: 'thanh cong ' });
    } else {
        return res.status(200).json({ massage: 'khong co de xuat nao da duyet ' });
    }
}
//đề xuất đang thoe dõi  đã được từ chối active = 2
exports.deXuat_Follow_da_tu_choi = async (req, res) => {
    if (info_de_xuat_da_tu_choi.length > 0) {
        return res.status(200).json({ data: info_de_xuat_da_tu_choi, message: 'thanh cong ' });
    } else {
        return res.status(200).json({ massage: 'khong co de xuat nao da tu choi ' });
    }
}

exports.deXuat_het_han_duyet = async (req, res) => {
    if (het_han_duyet.length > 0) {
        return res.status(200).json({ data: het_han_duyet, message: ' thanh cong ' })
    } else {

    }
    return res.status(200).json({ message: ' khong co de xuat het han duyet  ' })
}
//trang admin
exports.admin_danh_sach_de_xuat = async (req, res) => {
    let id_phong_ban = req.body.id_phong_ban ? req.body.id_phong_ban : 0;
    let id_user = req.body.id_user ? req.body.id_user : 0;
    let loai_de_xuat = req.body.loai_de_xuat ? req.body.loai_de_xuat : 0;
    let trang_thai_de_xuat = req.body.active ? req.body.active : 0;
    let time_send_from = req.body.time_send_form ? req.body.time_send_form : new Date('1970-01-01').getTime();
    let time_send_to = req.body.time_send_to ? req.body.time_send_to : new Date().getTime();

    let page = Number(req.body.page) ? Number(req.body.page) : 1;
    let pageSize = Number(req.body.pageSize) ? Number(req.body.pageSize) : 10;
    const skip = (page - 1) * pageSize;
    let condition = {};
    if (id_phong_ban) {
        condition.phong_ban = Number(id_phong_ban);
    }
    if (id_user) {
        condition.id_user = Number(id_user);
    }


    if (trang_thai_de_xuat) {
        condition.active = Number(trang_thai_de_xuat);
    }
    let filterArray = [];

    de_Xuat = await De_Xuat.find(condition).skip(skip).limit(pageSize);

    if (de_Xuat) {

        for (let i = 0; i < de_Xuat.length; i++) {

            if (loai_de_xuat) {

                if (de_Xuat[i].name_dx.includes(loai_de_xuat)) {
                    let de_xuat = {
                        _id: de_Xuat[i]._id,
                        id_user: de_Xuat[i].id_user,
                        name_dx: de_Xuat[i].name_dx,
                        type_dx: de_Xuat[i].type_dx,
                        type_duyet: de_Xuat[i].type_duyet,//3- huy 5-duyệt 6 -bắt buộc đi làm 7- đã tiếp nhận
                        active: de_Xuat[i].active,//đòng ý hoặc từ chối 
                        time_create: de_Xuat[i].time_create,
                        phong_ban: de_Xuat[i].phong_ban,
                    }
                    if (de_xuat.time_create >= time_send_from && de_xuat.time_create <= time_send_to) {

                        filterArray.push(de_xuat);

                    }
                }
            } else {
                let de_xuat = {
                    _id: de_Xuat[i]._id,
                    id_user: de_Xuat[i].id_user,
                    name_dx: de_Xuat[i].name_dx,
                    type_dx: de_Xuat[i].type_dx,
                    type_duyet: de_Xuat[i].type_duyet,//3- huy 5-duyệt 6 -bắt buộc đi làm 7- đã tiếp nhận
                    active: de_Xuat[i].active,//đòng ý hoặc từ chối 
                    time_create: de_Xuat[i].time_create,
                    phong_ban: de_Xuat[i].phong_ban,
                }
                if (de_xuat.time_create >= time_send_from && de_xuat.time_create <= time_send_to) {

                    filterArray.push(de_xuat);

                }
            }

        }

        //         }
        //         if (id_phong_ban === 0 && id_user === 0 && loai_de_xuat === 0 && trang_thai_de_xuat === 0) {
        //             filterArray.push(de_xuat);
        //         } else if (id_phong_ban === 0 && id_user === 0) {
        //             return res.status(404).json({ massage: 'id user null' })
        //         }


        //         if (id_phong_ban !== 0 && id_user !== 0 && loai_de_xuat === 0 && trang_thai_de_xuat === 0) {
        //             console.log(" de_xuat.phong_ban: " + de_xuat.phong_ban);
        //             console.log(" de_xuat.id_user: " + de_xuat.id_user);
        //             if (de_xuat.time_create >= time_send_from && de_xuat.time_create <= time_send_to &&
        //                 de_xuat.phong_ban == id_phong_ban && de_xuat.id_user == id_user) {

        //                 filterArray.push(de_xuat);

        //             }
        //         }
        //         if (id_phong_ban !== 0 && id_user !== 0 && loai_de_xuat !== 0 && trang_thai_de_xuat === 0) {
        //             if (de_Xuat[i].time_create >= time_send_from && de_Xuat[i].time_create <= time_send_to &&
        //                 de_Xuat[i].phong_ban == id_phong_ban && de_Xuat[i].id_user == id_user && de_Xuat[i].type_dx == loai_de_xuat) {
        //                 filterArray.push(de_xuat);

        //             }

        //         }
        //         if (id_phong_ban !== 0 && id_user !== 0 && loai_de_xuat !== 0 && trang_thai_de_xuat !== 0) {
        //             if (de_Xuat[i].time_create >= time_send_from && de_Xuat[i].time_create <= time_send_to &&
        //                 de_Xuat[i].phong_ban == id_phong_ban && de_Xuat[i].id_user == id_user && de_Xuat[i].type_dx == loai_de_xuat
        //                 && de_Xuat[i].type_duyet === trang_thai_de_xuat) {
        //                 filterArray.push(de_xuat);

        //             }
        //         }
        //         if (id_phong_ban == 0 && id_user !== 0 && loai_de_xuat === 0 && trang_thai_de_xuat === 0) {
        //             if (de_Xuat[i].time_create >= time_send_from && de_Xuat[i].time_create <= time_send_to &&
        //                 de_Xuat[i].id_user == id_user) {
        //                 filterArray.push(de_xuat);

        //             }
        //         }
        //         if (id_user !== 0 && loai_de_xuat === 0 && trang_thai_de_xuat !== 0) {
        //             if (de_Xuat[i].time_create >= time_send_from && de_Xuat[i].time_create <= time_send_to &&
        //                 de_Xuat[i].id_user == id_user && de_Xuat[i].type_duyet == trang_thai_de_xuat) {
        //                 filterArray.push(de_xuat);

        //             }
        //         }
        //         if (id_phong_ban === 0 && id_user !== 0 && loai_de_xuat !== 0 && trang_thai_de_xuat === 0) {
        //             if (de_Xuat[i].time_create >= time_send_from && de_Xuat[i].time_create <= time_send_to &&
        //                 de_Xuat[i].id_user == id_user && de_Xuat[i].type_dx == loai_de_xuat) {
        //                 filterArray.push(de_xuat);

        //             }
        //         }
        //         if (id_phong_ban === 0 && id_user !== 0 && loai_de_xuat !== 0 && trang_thai_de_xuat !== 0) {
        //             if (de_Xuat[i].time_create >= time_send_from && de_Xuat[i].time_create <= time_send_to &&
        //                 de_Xuat[i].id_user == id_user && de_Xuat[i].type_dx == loai_de_xuat && de_Xuat[i].type_duyet == trang_thai_de_xuat) {
        //                 filterArray.push(de_xuat);

        //             }
        //         }
        //         if (id_phong_ban === 0 && id_user === 0 && loai_de_xuat !== 0 && trang_thai_de_xuat === 0) {
        //             if (de_Xuat[i].time_create >= time_send_from && de_Xuat[i].time_create <= time_send_to &&
        //                 de_Xuat[i].type_dx == loai_de_xuat) {
        //                 filterArray.push(de_xuat);

        //             }
        //         }
        //         if (id_phong_ban === 0 && id_user === 0 && loai_de_xuat === 0 && trang_thai_de_xuat !== 0) {
        //             if (de_Xuat[i].time_create >= time_send_from && de_Xuat[i].time_create <= time_send_to &&
        //                 de_Xuat[i].type_duyet == trang_thai_de_xuat) {
        //                 filterArray.push(de_xuat);

        //             }
        //}
        //}

        return res.status(200).json({ data: filterArray, massage: 'thanh cong ' });
    } else {
        return res.satus(200).json("khong co de xuat nao ");
    }
}