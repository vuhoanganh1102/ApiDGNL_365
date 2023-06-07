
const De_Xuat = require('../../../models/Vanthu/de_xuat');
const cate_de_xuat = require('../../../models/Vanthu/cate_de_xuat');
const settingdx = require('../../../models/Vanthu365/setting_dx');
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
    let time_send_from = req.body.time_send_from ? req.body.time_send_from : new Date('1970-01-01').getTime();
    // console.log("time_send_from " + time_send_from);
    let time_send_to = req.body.time_send_to ? req.body.time_send_to : new Date().getTime();
    // console.log("time_send_to" + time_send_to);


    c


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
    // console.log("time_send_from " + time_send_from);
    let time_send_to = req.body.time_send_to ? req.body.time_send_to : new Date().getTime();
    //console.log(id_user_duyet);

    if (id_user_duyet) {
        if (!isNaN(id_user_duyet)) {

            info_de_xuat_All = [];
            info_de_xuat_cho_duyet = [];
            info_de_xuat_da_duyet = [];
            info_de_xuat_da_tu_choi = [];
            de_Xuat = [];

            de_Xuat = await De_Xuat.find({ id_user_duyet: id_user_duyet });
            console.log(de_Xuat);
            if (de_Xuat) {

                for (let i = 0; i < de_Xuat.length; i++) {
                    let de_xuat = {
                        _id: de_Xuat[i]._id,
                        name_use: de_Xuat[i].name_user,
                        name_dx: de_Xuat[i].name_dx,
                        type_duyet: item.type_duyet,//3- huy 5-duyệt 6 -bắt buộc đi làm 7- đã tiếp nhận
                        active: de_Xuat[i].active,//đòng ý hoặc từ chối 
                        time_create: de_Xuat[i].time_create,
                    }
                    if (id_user === 0) {
                        if (de_Xuat[i].time_create >= time_send_from && de_Xuat[i].time_create <= time_send_to) {
                            // console.log("nguoi nhan rong ")
                            info_de_xuat_All.push(de_xuat);
                            // console.log("de xuat_all : " + info_de_xuat_All);
                        }
                    } else {

                        if (de_Xuat[i].time_create >= time_send_from && de_Xuat[i].time_create <= time_send_to && de_Xuat[i].id_user == id_user) {
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
    let han_duyet = 0;
    const setting_Dx = await settingdx.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
    console.log("serttting dx: " + setting_Dx);
    //  console.log(setting_Dx);
    han_duyet = (setting_Dx.timeLimit * 60 * 60) / 1000;// tính theo giờ
    console.log(han_duyet);

    console.log(id_user_theo_doi);

    if (id_user_theo_doi) {
        if (!isNaN(id_user_theo_doi)) {

            info_de_xuat_All = [];
            info_de_xuat_cho_duyet = [];
            info_de_xuat_da_duyet = [];
            info_de_xuat_da_tu_choi = [];
            de_Xuat = [];

            de_Xuat = await De_Xuat.find({ id_user_theo_doi: id_user_theo_doi });
            // console.log(de_Xuat);
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

                    }
                    //console.log(new Date().getTime() - de_xuat.time_create)
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


                    if (info_de_xuat_All[i].time_create + han_duyet < new Date().getTime()) {
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

    } else {
        return res.status(404).json('bad request');
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
        return res.status(200).json({ data: het_han_duyet, message: ' thanh cng ' })
    } else {

    }
    return res.status(200).json({ message: ' khong co de xuat het han duyet  ' })
}
//trang admin
exports.admin_danh_sach_de_xuat = async (req, res) => {
    let id_phong_ban = req.body.id_phong_ban ? req.body.id_phong_ban : 0;
    let id_user = req.body.id_user ? req.body.id_user : 0;
    let loai_de_xuat = req.body.loai_de_xuat ? req.body.loai_de_xuat : 0;
    let trang_thai_de_xuat = req.body.active ? trang_thai_de_xuat : 0;
    let time_send_from = req.body.time_send_form ? req.body.time_send_form : new Date('1970-01-01').getTime();
    let time_send_to = req.body.time_send_to ? req.body.time_send_to : new Date().getTime();
    console.log("id_phong_ban: " + id_phong_ban);
    console.log("id_user: " + id_user);
    console.log("loai_de_xuat: " + loai_de_xuat);
    console.log("trang_thai_de_xuat: " + trang_thai_de_xuat);

    let filterArray = [];

    de_Xuat = await De_Xuat.find({});
    if (de_Xuat) {

        for (let i = 0; i < de_Xuat.length; i++) {
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
            if (id_phong_ban === 0 && id_user === 0 && loai_de_xuat === 0 && trang_thai_de_xuat === 0) {
                filterArray.push(de_xuat);
            } else if (id_phong_ban === 0 && id_user === 0) {
                return res.status(404).json({ massage: 'id user null' })
            }


            if (id_phong_ban !== 0 && id_user !== 0 && loai_de_xuat === 0 && trang_thai_de_xuat === 0) {
                console.log(" de_xuat.phong_ban: " + de_xuat.phong_ban);
                console.log(" de_xuat.id_user: " + de_xuat.id_user);
                if (de_xuat.time_create >= time_send_from && de_xuat.time_create <= time_send_to &&
                    de_xuat.phong_ban == id_phong_ban && de_xuat.id_user == id_user) {

                    filterArray.push(de_xuat);

                }
            }
            if (id_phong_ban !== 0 && id_user !== 0 && loai_de_xuat !== 0 && trang_thai_de_xuat === 0) {
                if (de_Xuat[i].time_create >= time_send_from && de_Xuat[i].time_create <= time_send_to &&
                    de_Xuat[i].phong_ban == id_phong_ban && de_Xuat[i].id_user == id_user && de_Xuat[i].type_dx == loai_de_xuat) {
                    filterArray.push(de_xuat);

                }

            }
            if (id_phong_ban !== 0 && id_user !== 0 && loai_de_xuat !== 0 && trang_thai_de_xuat !== 0) {
                if (de_Xuat[i].time_create >= time_send_from && de_Xuat[i].time_create <= time_send_to &&
                    de_Xuat[i].phong_ban == id_phong_ban && de_Xuat[i].id_user == id_user && de_Xuat[i].type_dx == loai_de_xuat
                    && de_Xuat[i].type_duyet === trang_thai_de_xuat) {
                    filterArray.push(de_xuat);

                }
            }
            if (id_user !== 0 && loai_de_xuat === 0 && trang_thai_de_xuat === 0) {
                if (de_Xuat[i].time_create >= time_send_from && de_Xuat[i].time_create <= time_send_to &&
                    de_Xuat[i].id_user == id_user) {
                    filterArray.push(de_xuat);

                }
            }
            if (id_user !== 0 && loai_de_xuat === 0 && trang_thai_de_xuat !== 0) {
                if (de_Xuat[i].time_create >= time_send_from && de_Xuat[i].time_create <= time_send_to &&
                    de_Xuat[i].id_user == id_user && de_Xuat[i].type_duyet == trang_thai_de_xuat) {
                    filterArray.push(de_xuat);

                }
            }
            if (id_phong_ban === 0 && id_user !== 0 && loai_de_xuat !== 0 && trang_thai_de_xuat === 0) {
                if (de_Xuat[i].time_create >= time_send_from && de_Xuat[i].time_create <= time_send_to &&
                    de_Xuat[i].id_user == id_user && de_Xuat[i].type_dx == loai_de_xuat) {
                    filterArray.push(de_xuat);

                }
            }
            if (id_phong_ban === 0 && id_user !== 0 && loai_de_xuat !== 0 && trang_thai_de_xuat !== 0) {
                if (de_Xuat[i].time_create >= time_send_from && de_Xuat[i].time_create <= time_send_to &&
                    de_Xuat[i].id_user == id_user && de_Xuat[i].type_dx == loai_de_xuat && de_Xuat[i].type_duyet == trang_thai_de_xuat) {
                    filterArray.push(de_xuat);

                }
            }
            if (id_phong_ban === 0 && id_user === 0 && loai_de_xuat !== 0 && trang_thai_de_xuat === 0) {
                if (de_Xuat[i].time_create >= time_send_from && de_Xuat[i].time_create <= time_send_to &&
                    de_Xuat[i].type_dx == loai_de_xuat) {
                    filterArray.push(de_xuat);

                }
            }
            if (id_phong_ban === 0 && id_user === 0 && loai_de_xuat === 0 && trang_thai_de_xuat !== 0) {
                if (de_Xuat[i].time_create >= time_send_from && de_Xuat[i].time_create <= time_send_to &&
                    de_Xuat[i].type_duyet == trang_thai_de_xuat) {
                    filterArray.push(de_xuat);

                }
            }
        }
        return res.status(200).json({ data: filterArray, massage: 'thanh cong ' });
    } else {
        return res.satus(200).json("khong co de xuat nao ");
    }
}