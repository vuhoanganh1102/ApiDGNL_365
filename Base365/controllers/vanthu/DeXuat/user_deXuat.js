
const De_Xuat = require('../../../models/Vanthu/de_xuat');

// let info_de_xuat_All = [];
// let info_de_xuat_cho_duyet = [];
// let info_de_xuat_da_duyet = [];
// let info_de_xuat_da_tu_choi = [];
// let de_xuat = [];


function get_info_deXuat(item, time_send_from, time_send_to, nguoi_nhan_de_xuat) {
    const de_xuat = {
        _id: item._id,
        name_use: item.name_user,
        name_dx: item.name_dx,
        //  type_duyet: item.type_duyet,//3- huy 5-duyệt 6 -bắt buộc đi làm 7- đã tiếp nhận
        active: item.active,//đòng ý hoặc từ chối 
        time_create: item.time_create,
    }

    //theo model cũ trong mysql 1- là bên thứ 3 đòng ý 2- là bên thứ 3 không đồng ý 
    if (item.active == 0) {
        info_de_xuat_cho_duyet.push(de_xuat);
    }
    if (item.active == 1) {
        info_de_xuat_da_duyet.push(de_xuat);
    }

    if (item.active == 2) {
        info_de_xuat_da_tu_choi.push(de_xuat);
    }
    if (typeof (nguoi_nhan_de_xuat) == 'Number') {
        if (item.time_create >= time_send_from && item.time_create <= time_send_to) {
            info_de_xuat_All.push(de_xuat);
        }
    } else {
        if (item.time_create >= time_send_from && item.time_create <= time_send_to && item.id_user_duyet == nguoi_nhan_de_xuat) {
            info_de_xuat_All.push(de_xuat);
        }
    }


}


// đề xuất tôi gửi đi 
exports.deXuat_user_send = async (req, res) => {
    let time_send_to = new Date().getTime();
    let time_send_from = null;
    let nguoi_nhan_de_xuat = 0;
    let id_user = req.body.id_user;
    nguoi_nhan_de_xuat = req.body.id_user_duyet;
    time_send_from = req.body.ngay_bd;
    time_send_to = req.body.ngay_kt;
    //console.log(nguoi_nhan_de_xuat);
    let info_de_xuat_All = [];
    let info_de_xuat_cho_duyet = [];
    let info_de_xuat_da_duyet = [];
    let info_de_xuat_da_tu_choi = [];
    let de_Xuat = [];
    if (id_user) {
        // de_xuat.splice(0, de_xuat.length);
        // info_de_xuat_All.splice(0, info_de_xuat_All.length);
        // info_de_xuat_da_tu_choi.splice(0, info_de_xuat_da_tu_choi.length);
        // info_de_xuat_da_duyet.splice(0, info_de_xuat_da_duyet.length);
        // info_de_xuat_cho_duyet.splice(0, info_de_xuat_cho_duyet.length);

        de_Xuat = await De_Xuat.find({ id_user: id_user });

        //de_xuat.forEach(get_info_deXuat(time_send_from, time_send_to, nguoi_nhan_de_xuat));

        //console.log("de xuat all: " + de_Xuat);

        // console.log("de xuat da duyet : " + info_de_xuat_da_duyet);


    } else {
        return res.status(404).json('bad request');
    }

    if (de_Xuat) {

        for (let i = 0; i < de_Xuat.length; i++) {
            let de_xuat = {
                _id: de_Xuat[i]._id,
                name_use: de_Xuat[i].name_user,
                name_dx: de_Xuat[i].name_dx,
                //  type_duyet: item.type_duyet,//3- huy 5-duyệt 6 -bắt buộc đi làm 7- đã tiếp nhận
                active: de_Xuat[i].active,//đòng ý hoặc từ chối 
                time_create: de_Xuat[i].time_create,
            }
            console.log("de xuat da duyet : " + de_xuat._id);


            if (nguoi_nhan_de_xuat == 0) {
                // console.log("de xuat_all : " + Date.now());
                if (de_Xuat[i].time_create >= time_send_from && de_Xuat[i].time_create <= time_send_to) {
                    console.log("nguoi nha nrong ")
                    info_de_xuat_All.push(de_xuat);
                    console.log("de xuat_all : " + info_de_xuat_All);
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
        return res.status(200).json({ message: " khong co de xuat nao cho uer" });
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
    console.log(id_user_duyet);

    if (id_user_duyet) {
        de_xuat.splice(0, de_xuat.length);
        info_de_xuat_All.splice(0, info_de_xuat_All.length);
        info_de_xuat_da_tu_choi.splice(0, info_de_xuat_da_tu_choi.length);
        info_de_xuat_da_duyet.splice(0, info_de_xuat_da_duyet.length);
        info_de_xuat_cho_duyet.splice(0, info_de_xuat_cho_duyet.length);

        // /de_xuat= []
        //info_de_xuat_All = []
        //info_de_xuat_da_tu_choi = []

        de_xuat = await De_Xuat.find({ id_user_duyet: id_user_duyet });

        de_xuat.forEach(get_info_deXuat);
        // console.log(info_de_xuat);


    } else {
        return res.status(404).json('bad request');
    }

    if (de_xuat) {
        return res.status(200).json({ data: info_de_xuat_All, message: 'thanh cong' });
    } else {
        return res.status(200).json({ message: " khong co de xuat can duyet nao cho user" });
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
    console.log(id_user_theo_doi);

    if (id_user_theo_doi) {
        de_xuat.splice(0, de_xuat.length);
        info_de_xuat_All.splice(0, info_de_xuat_All.length);
        info_de_xuat_da_tu_choi.splice(0, info_de_xuat_da_tu_choi.length);
        info_de_xuat_da_duyet.splice(0, info_de_xuat_da_duyet.length);
        info_de_xuat_cho_duyet.splice(0, info_de_xuat_cho_duyet.length);


        de_xuat = await De_Xuat.find({ id_user_theo_doi: id_user_theo_doi });

        de_xuat.forEach(get_info_deXuat);
        // console.log(info_de_xuat);


    } else {
        return res.status(404).json('bad request');
    }

    if (de_xuat) {
        return res.status(200).json({ data: info_de_xuat_All, message: 'thanh cong' });
    } else {
        return res.status(200).json({ message: " khong co de xuat can duyet nao cho user" });
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