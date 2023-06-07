const De_Xuat = require('../../../models/Vanthu/de_xuat');
const functions = require('../../../services/vanThu');
const multer = require('multer');
const path = require('path');



exports.de_xuat_xin_nghi = async (req, res) => {
    let {
        name_dx,
        type_dx,//int 
        name_user,
        id_user,
        com_id,
        kieu_duyet,// 0-kiểm duyệt lần lượt hay đồng thời 
        id_user_duyet,
        id_user_theo_doi,
        phong_ban,
        // file_kem,
        ly_do,

        bd_nghi,
        kt_nghi,
        loai_np,
        type_time,
        ca_nghi,
    } = req.body;


    let file_kem = req.files.fileKem;
    // console.log(file_kem);
    //await functions.uploadFileVanThu(id_user, file_kem);



    if (!name_dx || !type_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
        return res.status(404).json("bad request ");

    } else {


        if (bd_nghi) {

        }
        let maxID = 0;
        const de_xuat = await De_Xuat.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
        //   console.log(de_xuat);
        if (de_xuat) {
            maxID = de_xuat._id;
        }

        //console.log("mx : " + maxID);
        const new_de_xuat = new De_Xuat({
            _id: (maxID + 1),
            name_dx: name_dx,
            type_dx: type_dx,
            phong_ban: phong_ban,
            noi_dung: {
                nghi_phep: {
                    ly_do: ly_do,
                    bd_nghi: bd_nghi,
                    kt_nghi: kt_nghi,
                    loai_np: loai_np,
                    ca_nghi: ca_nghi,
                }

            },
            name_user: name_user,
            id_user: id_user,
            com_id: com_id,
            kieu_duyet: kieu_duyet,
            id_user_duyet: id_user_duyet,
            id_user_theo_doi: id_user_theo_doi,
            //   file_kem: file_kem,
            kieu_duyet: 0,
            type_duyet: 0,
            type_time: type_time,
            time_start_out: " ",
            time_create: new Date(),
            time_tiep_nhan: null,
            time_duyet: null,
            active: 1,//1-bên 3 đã đồng ý , 2 - bên 3 không đồng ý 
            del_type: 1,//1-active , 2 --delete
        })


        await new_de_xuat.save();


    }
    return res.status(200).json("success ");

}

