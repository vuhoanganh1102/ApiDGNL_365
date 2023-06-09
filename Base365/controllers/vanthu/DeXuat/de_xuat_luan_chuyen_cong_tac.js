const De_Xuat = require('../../../models/Vanthu/de_xuat');
const Cate_Dx = require('../../../models/Vanthu/cate_de_xuat');
const functions = require('../../../services/vanthu');
exports.de_xuat_luan_chuyen_cong_tac = async (req, res) => {
    let {
        name_dx,
        type_dx,//int 
        name_user,
        id_user,
        com_id,
        kieu_duyet,// 0-kiểm duyệt lần lượt hay đồng thời 
        id_user_duyet,
        id_user_theo_doi,
        // file_kem,
        ly_do,

        cv_nguoi_lc,
        pb_nguoi_lc,
        noi_cong_tac,
        noi_chuyen_den,
    } = req.body;

    let file_kem = req.files.fileKem;
    // console.log(file_kem);
    await functions.uploadFileVanThu(id_user, file_kem);
    const imagePath = path.resolve(__dirname, `../Storage/base365/vanthu/tailieu/${id_user}`, file_kem.name);
    const pathString = imagePath.toString();
    console.log(pathString)


    //console.log(name_ph_bn);
    if (!name_dx || !type_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
        return res.status(404).json("bad request ");

    } else {
        let maxID = 0;
        const de_xuat = await De_Xuat.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
        console.log(de_xuat);
        if (de_xuat) {
            maxID = de_xuat._id;
        }

        //console.log("mx : " + maxID);
        const new_de_xuat = new De_Xuat({
            _id: (maxID + 1),
            name_dx: name_dx,
            type_dx: type_dx,
            noi_dung: {
                luan_chuyen_cong_tac: {
                    cv_nguoi_lc: cv_nguoi_lc,
                    pb_nguoi_lc: pb_nguoi_lc,
                    ly_do: ly_do,
                    noi_cong_tac: noi_cong_tac,
                    noi_chuyen_den: noi_chuyen_den
                }

            },
            name_user: name_user,
            id_user: id_user,
            com_id: com_id,
            kieu_duyet: kieu_duyet,
            id_user_duyet: id_user_duyet,
            id_user_theo_doi: id_user_theo_doi,
            file_kem: pathString,
            kieu_duyet: kieu_duyet,
            type_duyet: 0,
            type_time: 0,
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

