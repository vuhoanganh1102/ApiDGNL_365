const De_Xuat = require('../../../models/Vanthu/de_xuat');
const functions = require('../../../services/vanthu');
const multer = require('multer');
const path = require('path');
const thongBao = require('../../../models/Vanthu365/tl_thong_bao');


//đề xuất xin nghỉ 
exports.de_xuat_xin_nghi = async (req, res) => {
    console.log("xin ngihr ");
    let {
        name_dx,
        name_user,
        id_user,
        com_id,
        kieu_duyet,// 0-kiểm duyệt lần lượt hay đồng thời 
        id_user_duyet,
        id_user_theo_doi,
        phong_ban,
        ly_do,

        bd_nghi,
        kt_nghi,
        loai_np,
        //  type_time,
        ca_nghi,
        link
    } = req.body;


    let file_kem = req.files.fileKem;

    let pathString = "";
    if (file_kem) {
        await functions.uploadFileVanThu(id_user, file_kem);
        let imagePath = path.resolve(__dirname, `../Storage/base365/vanthu/tailieu/${id_user}`, file_kem.name);
        pathString = imagePath.toString();
    }



    // console.log(pathString)
    if (!name_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
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
            type_dx: 1,
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
            file_kem: pathString,
            kieu_duyet: 0,
            //   type_duyet: 0,
            //  type_time: type_time,
            //time_start_out: " ",
            time_create: new Date(),
            //  time_tiep_nhan: null,
            //  time_duyet: null,
            // active: 1,//1-bên 3 đã đồng ý , 2 - bên 3 không đồng ý 
            // del_type: 1,//1-active , 2 --delete
        });


        await new_de_xuat.save();
        functions.chat(name_dx, name_user, new_de_xuat.noi_dung.nghi_phep, new_de_xuat.file_kem);

        maxID = 0;
        const tb = await thongBao.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
        //   console.log(de_xuat);
        if (tb) {
            maxID = tb.id_thong_bao;
        }
        const t_bao = new thongBao({
            id_thong_bao: maxID + 1,
            id_user: id_user,
            id_user_nhan: id_user_duyet,
            id_van_ban: new_de_xuat._id,
            type: 2,
            view: 0,
            created_date: Date.now(),


        })
        await t_bao.save();
        return res.status(200).json("success ");

    }


}
//đề xuất bổ nhiệm 
exports.de_xuat_xin_bo_nhiem = async (req, res) => {
    let {
        name_dx,
        // type_dx,//int 
        name_user,
        id_user,
        com_id,
        kieu_duyet,// 0-kiểm duyệt lần lượt hay đồng thời 
        id_user_duyet,
        id_user_theo_doi,
        ly_do,

        thanhviendc_bn,
        name_ph_bn,
        chucvu_hientai,
        chucvu_dx_bn,
        phong_ban_moi,
        phong_ban


    } = req.body;


    let file_kem = req.files.fileKem;
    // console.log(file_kem);
    await functions.uploadFileVanThu(id_user, file_kem);
    let imagePath = path.resolve(__dirname, `../Storage/base365/vanthu/tailieu/${id_user}`, file_kem.name);
    let pathString = imagePath.toString();
    console.log(pathString);
    console.log(name_ph_bn);
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
            type_dx: 7,
            noi_dung: {
                bo_nhiem: {
                    ly_do: ly_do,
                    thanhviendc_bn: thanhviendc_bn,
                    name_ph_bn: name_ph_bn,
                    chucvu_hientai: chucvu_hientai,
                    chucvu_dx_bn: chucvu_dx_bn,
                    phong_ban_moi: phong_ban_moi
                }

            },
            name_user: name_user,
            phong_ban: phong_ban,
            id_user: id_user,
            com_id: com_id,
            kieu_duyet: kieu_duyet,
            id_user_duyet: id_user_duyet,
            id_user_theo_doi: id_user_theo_doi,
            file_kem: pathString,
            kieu_duyet: 0,
            // type_duyet: 0,
            // type_time: 0,
            //  time_start_out: " ",
            time_create: new Date(),
            //  time_tiep_nhan: null,
            //  time_duyet: null,
            //  active: 1,//1-bên 3 đã đồng ý , 2 - bên 3 không đồng ý 
            //   del_type: 1,//1-active , 2 --delete
        })


        await new_de_xuat.save();
        functions.chat(name_dx, name_user, new_de_xuat.noi_dung.bo_nhiem, new_de_xuat.file_kem);

        return res.status(200).json("success ");
    }


}


//đề xuất cấp phát tài sản
exports.de_xuat_xin_cap_phat_tai_san = async (req, res) => {
    let {
        name_dx,
        //  type_dx,//int 
        name_user,
        id_user,
        com_id,
        kieu_duyet,// 0-kiểm duyệt lần lượt hay đồng thời 
        id_user_duyet,
        id_user_theo_doi,
        //  file_kem,
        ly_do,
        phong_ban,
        type_time,
        danh_sach_tai_san,
        so_luong_tai_san,

    } = req.body;
    let file_kem = req.files.fileKem;
    // console.log(file_kem);
    await functions.uploadFileVanThu(id_user, file_kem);
    let imagePath = path.resolve(__dirname, `../Storage/base365/vanthu/tailieu/${id_user}`, file_kem.name);
    let pathString = imagePath.toString();
    console.log(pathString)


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
            type_dx: 4,
            noi_dung: {
                cap_phat_tai_san: {
                    ly_do: ly_do,
                    danh_sach_tai_san: danh_sach_tai_san,
                    so_luong_tai_san: (so_luong_tai_san),
                }

            },
            name_user: name_user,
            id_user: id_user,
            com_id: com_id,
            kieu_duyet: kieu_duyet,

            phong_ban: phong_ban,
            id_user_duyet: id_user_duyet,
            id_user_theo_doi: id_user_theo_doi,
            file_kem: pathString,
            kieu_duyet: kieu_duyet,
            //  type_duyet: 0,
            type_time: type_time,
            // time_start_out: " ",
            time_create: new Date(),
            time_tiep_nhan: null,
            time_duyet: null,
            active: 0,//1-bên 3 đã đồng ý , 2 - bên 3 không đồng ý 
            del_type: 1,//1-active , 2 --delete
        })
        await new_de_xuat.save();
        functions.chat(name_dx, name_user, new_de_xuat.noi_dung.cap_phat_tai_san, new_de_xuat.file_kem);
        return res.status(200).json("success ");
    }


}

//đề xuất đổi ca 
exports.de_xuat_doi_ca = async (req, res) => {
    console.log("doi ca ");
    let {
        name_dx,
        //  type_dx,//int 
        name_user,
        id_user,
        com_id,
        kieu_duyet,// 0-kiểm duyệt lần lượt hay đồng thời 
        id_user_duyet,
        id_user_theo_doi,
        // file_kem,
        ly_do,
        phong_ban,
        ngay_can_doi,
        ca_can_doi,
        ngay_muon_doi,
        ca_muon_doi,

    } = req.body;
    let file_kem = req.files.fileKem;
    // console.log(file_kem);
    await functions.uploadFileVanThu(id_user, file_kem);
    let imagePath = path.resolve(__dirname, `../Storage/base365/vanthu/tailieu/${id_user}`, file_kem.name);
    let pathString = imagePath.toString();
    console.log(pathString)
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
            type_dx: 2,
            noi_dung: {
                doi_ca: {
                    ngay_can_doi: ngay_can_doi,
                    ca_can_doi: ca_can_doi,
                    ngay_muon_doi: ngay_muon_doi,
                    ca_muon_doi: ca_muon_doi,
                    ly_do: ly_do
                }
            },
            name_user: name_user,
            id_user: id_user,
            com_id: com_id,
            phong_ban: phong_ban,
            kieu_duyet: kieu_duyet,
            id_user_duyet: id_user_duyet,
            id_user_theo_doi: id_user_theo_doi,
            file_kem: pathString,
            kieu_duyet: kieu_duyet,
            //  type_duyet: 0,
            //  type_time: 0,
            //  time_start_out: " ",
            time_create: new Date(),
            // time_tiep_nhan: null,
            // time_duyet: null,
            // active: 1,//1-bên 3 đã đồng ý , 2 - bên 3 không đồng ý 
            //   del_type: 1,//1-active , 2 --delete
        })


        await new_de_xuat.save();
        functions.chat(name_dx, name_user, new_de_xuat.noi_dung.doi_ca, new_de_xuat.file_kem);

        return res.status(200).json("success ");
    }


}


//đề xuất luân chuyển công tác 
exports.de_xuat_luan_chuyen_cong_tac = async (req, res) => {
    let {
        name_dx,
        // type_dx,//int 
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
            type_dx: 8,
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
            // type_duyet: 0,
            //  type_time: 0,
            //   time_start_out: " ",
            time_create: new Date(),
            //   time_tiep_nhan: null,
            //   time_duyet: null,
            // active: 1,//1-bên 3 đã đồng ý , 2 - bên 3 không đồng ý 
            //   del_type: 1,//1-active , 2 --delete
        })


        await new_de_xuat.save();
        functions.chat(name_dx, name_user, new_de_xuat.noi_dung.luan_chuyen_cong_tac, new_de_xuat.file_kem);

        return res.status(200).json("success ");
    }


}

//đề xuất tăng lương 
exports.de_xuat_tang_luong = async (req, res) => {
    let {
        name_dx,
        //  type_dx,//int 
        name_user,
        id_user,
        com_id,
        kieu_duyet,// 0-kiểm duyệt lần lượt hay đồng thời 
        id_user_duyet,
        id_user_theo_doi,
        //  file_kem,
        ly_do,

        mucluong_ht,
        mucluong_tang,
        date_tang_luong,


    } = req.body;


    let file_kem = req.files.fileKem;
    // console.log(file_kem);
    await functions.uploadFileVanThu(id_user, file_kem);
    const imagePath = path.resolve(__dirname, `../Storage/base365/vanthu/tailieu/${id_user}`, file_kem.name);
    const pathString = imagePath.toString();
    console.log(pathString)

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
            type_dx: 6,
            noi_dung: {
                tang_luong: {
                    mucluong_ht: mucluong_ht,
                    mucluong_tang: mucluong_tang,
                    date_tang_luong: date_tang_luong,
                    ly_do: ly_do
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
            //  type_duyet: 0,
            type_time: 0,
            // time_start_out: " ",
            time_create: new Date(),
            // time_tiep_nhan: 0,
            // time_duyet: 0,
            // active: 1,//1-bên 3 đã đồng ý , 2 - bên 3 không đồng ý 
            //  del_type: 1,//1-active , 2 --delete
        })


        await new_de_xuat.save();
        functions.chat(name_dx, name_user, new_de_xuat.noi_dung.tang_luong, new_de_xuat.file_kem);


        return res.status(200).json("success ");

    }

}

//đè xuất tham gia dự ấn 
exports.de_xuat_tham_gia_du_an = async (req, res) => {
    console.log("controller");
    let {
        name_dx,
        //  type_dx,//int 
        name_user,
        id_user,
        com_id,
        kieu_duyet,// 0-kiểm duyệt lần lượt hay đồng thời 
        id_user_duyet,
        id_user_theo_doi,
        //  file_kem,
        ly_do,

        cv_nguoi_da,
        pb_nguoi_da,
        dx_da,




    } = req.body;

    let file_kem = req.files.fileKem;
    // console.log(file_kem);
    await functions.uploadFileVanThu(id_user, file_kem);
    const imagePath = path.resolve(__dirname, `../Storage/base365/vanthu/tailieu/${id_user}`, file_kem.name);
    const pathString = imagePath.toString();
    console.log(pathString)


    if (!name_dx || !type_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi) {
        return res.status(404).json("bad request ");

    } else {
        let maxID = 0;
        const de_xuat = await De_Xuat.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
        console.log(de_xuat);
        if (de_xuat) {
            maxID = de_xuat._id;
        }


        const new_de_xuat = new De_Xuat({
            _id: (maxID + 1),
            name_dx: name_dx,
            type_dx: 9,
            noi_dung: {
                tham_gia_du_an: {
                    ly_do: ly_do,
                    cv_nguoi_da: cv_nguoi_da,
                    pb_nguoi_da: pb_nguoi_da,
                    dx_da: dx_da,
                }

            },
            name_user: name_user,
            id_user: id_user,
            com_id: com_id,
            kieu_duyet: kieu_duyet,
            id_user_duyet: id_user_duyet,
            id_user_theo_doi: id_user_theo_doi,
            file_kem: pathString,
            kieu_duyet: 0,
            type_duyet: 0,
            //  type_time: 0,
            //  time_start_out: " ",
            time_create: new Date(),
            // time_tiep_nhan: null,
            // time_duyet: null,
            // active: 1,//1-bên 3 đã đồng ý , 2 - bên 3 không đồng ý 
            /// del_type: 1,//1-active , 2 --delete
        })


        await new_de_xuat.save();
        functions.chat(name_dx, name_user, new_de_xuat.noi_dung.tham_gia_du_an, new_de_xuat.file_kem);

        return res.status(200).json("success ");

    }


}

//đề xuất xin tạm ứng lương
exports.de_xuat_xin_tam_ung = async (req, res) => {
    let {
        name_dx,
        //  type_dx,//int 
        name_user,
        id_user,
        com_id,
        kieu_duyet,// 0-kiểm duyệt lần lượt hay đồng thời 
        id_user_duyet,
        id_user_theo_doi,
        //   file_kem,

        ly_do,
        tien_tam_ung,
        ngay_tam_ung,


    } = req.body;

    let file_kem = req.files.fileKem;
    // console.log(file_kem);
    await functions.uploadFileVanThu(id_user, file_kem);
    const imagePath = path.resolve(__dirname, `../Storage/base365/vanthu/tailieu/${id_user}`, file_kem.name);
    const pathString = imagePath.toString();
    console.log(pathString)
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
            type_dx: 3,
            noi_dung: {
                tam_ung: {
                    ly_do: ly_do,
                    tien_tam_ung: tien_tam_ung,
                    ngay_tam_ung: ngay_tam_ung
                }

            },
            name_user: name_user,
            id_user: id_user,
            com_id: com_id,
            kieu_duyet: kieu_duyet,
            id_user_duyet: id_user_duyet,
            id_user_theo_doi: id_user_theo_doi,
            file_kem: pathString,
            kieu_duyet: 0,
            type_duyet: 0,
            type_time: 0,
            // time_start_out: " ",
            time_create: new Date(),
            // time_tiep_nhan: null,
            //time_duyet: null,
            active: 1,//1-bên 3 đã đồng ý , 2 - bên 3 không đồng ý 
            del_type: 1,//1-active , 2 --delete
        })


        await new_de_xuat.save();
        functions.chat(name_dx, name_user, new_de_xuat.noi_dung.tam_ung, new_de_xuat.file_kem);

        return res.status(200).json("success ");

    }


}

//đề xuất thôi việc 
exports.de_xuat_xin_thoi_Viec = async (req, res) => {
    let {
        name_dx,
        // type_dx,//int 
        name_user,
        id_user,
        com_id,
        kieu_duyet,// 0-kiểm duyệt lần lượt hay đồng thời 
        id_user_duyet,
        id_user_theo_doi,
        //  file_kem,
        ly_do,

        ngaybatdau_tv
    } = req.body;
    let file_kem = req.files.fileKem;
    // console.log(file_kem);
    await functions.uploadFileVanThu(id_user, file_kem);
    const imagePath = path.resolve(__dirname, `../Storage/base365/vanthu/tailieu/${id_user}`, file_kem.name);
    const pathString = imagePath.toString();
    console.log(pathString)
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
            type_dx: 5,
            noi_dung: {
                thoi_viec: {
                    ly_do: ly_do,
                    ngaybatdau_tv: ngaybatdau_tv,

                },
            },
            name_user: name_user,
            id_user: id_user,
            com_id: com_id,
            kieu_duyet: kieu_duyet,
            id_user_duyet: id_user_duyet,
            id_user_theo_doi: id_user_theo_doi,
            file_kem: pathString,
            kieu_duyet: kieu_duyet,
            //type_duyet: 0,
            // type_time: 0,
            //time_start_out: " ",
            time_create: new Date(),
            //  time_tiep_nhan: null,
            //  time_duyet: null,
            // active: 1,//1-bên 3 đã đồng ý , 2 - bên 3 không đồng ý 
            //  del_type: 1,//1-active , 2 --delete
        });


        await new_de_xuat.save();

        functions.chat(name_dx, name_user, new_de_xuat.noi_dung.thoi_viec, new_de_xuat.file_kem);

        return res.status(200).json("success ");
    }


}


exports.lich_lam_viec = async (req, res) => {
    let {
        name_dx,
        name_user,
        id_user,
        com_id,
        kieu_duyet,// 0-kiểm duyệt lần lượt hay đồng thời 
        id_user_duyet,
        id_user_theo_doi,
        ly_do,
        lich_lam_viec,
        thang_ap_dung,
        ngay_bat_dau,
        ca_lam_viec,
        ngay_lam_viec } = req.body;
    if (isNaN(id_user) || isNaN(id_user_duyet) || isNaN(id_user_theo_doi)) {
        return res.status(404).json({ message: "bad request" });
    } else {

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
            type_dx: 18,
            noi_dung: {
                lich_lam_viec: {
                    ly_do: ly_do,
                    lich_lam_viec: lich_lam_viec,
                    thang_ap_dung: thang_ap_dung,
                    ngay_bat_dau: ngay_bat_dau,
                    ca_la_viec: ca_lam_viec,
                    ngay_lam_viec: ngay_lam_viec,


                },
            },
            name_user: name_user,
            id_user: id_user,
            com_id: com_id,
            kieu_duyet: kieu_duyet,
            id_user_duyet: id_user_duyet,
            id_user_theo_doi: id_user_theo_doi,
            kieu_duyet: kieu_duyet,
            //type_duyet: 0,
            // type_time: 0,
            //time_start_out: " ",
            time_create: new Date(),
            //  time_tiep_nhan: null,
            //  time_duyet: null,
            // active: 1,//1-bên 3 đã đồng ý , 2 - bên 3 không đồng ý 
            //  del_type: 1,//1-active , 2 --delete
        });


        await new_de_xuat.save();

        functions.chat(name_dx, name_user, new_de_xuat.noi_dung.lich_lam_viec, new_de_xuat.file_kem);

        let tb = new thongBao({
            id_thong_bao: maxID + 1,
            id_user: id_user,
            id_user_nhan: id_user_duyet,
            id_van_ban: new_de_xuat._id,
            type: 2,
            view: 0,
            created_date: Date.now(),


        })
        await tb.save();
        return res.status(200).json({ data: new_de_xuat, message: "success " });





    }



}
