const DeXuat = require("../../../models/Vanthu/de_xuat");
const { storageVT } = require('../../../services/functions');
const multer = require('multer');
const functions = require('../../../services/vanthu')
const path = require('path');
const ThongBao = require("../../../models/Vanthu365/tl_thong_bao")




exports.dxHoaHong = async (req, res) => {
    try {
        let {
            name_dx,
            noi_dung,
            name_user,
            id_user,
            kieu_duyet,
            com_id,
            id_user_duyet,
            id_user_theo_doi,
            type_duyet,
            chu_ky ,
            doanh_thu_td,
            muc_doanh_thu,
            ly_do,
            time_hh
        } = req.body;
        let createDate = new Date()  
        if(!name_dx  || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi){
            return res.status(404).json('bad request')
        }else {
            let file_kem = req.files.file_kem;
            await functions.uploadFileVanThu(id_user, file_kem);
            let linkDL =   functions.createLinkFileVanthu(id_user,file_kem.name);
            let maxID = await functions.getMaxID(DeXuat);
            let _id = 0;
            if (maxID) {

                _id = Number(maxID) + 1;
            }
            let createDXHH = new DeXuat({
                _id : _id,
                name_dx: name_dx,
                type_dx: 20,
                noi_dung: {
                    hoa_hong: {
                        chu_ky: chu_ky ,
                        time_hh : time_hh,
                        doanh_thu_td : doanh_thu_td,
                        muc_doanh_thu : muc_doanh_thu,
                        ly_do : ly_do,
                    },
                },
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                kieu_duyet: kieu_duyet,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                file_kem: linkDL,
                type_duyet: type_duyet,
                time_create: createDate,
            });

            let savedDXHH = await createDXHH.save();
            let maxIDTB = await functions.getMaxID(ThongBao)
            let idTB = 0;
            if (maxIDTB) {
                idTB = Number(maxIDTB) + 1;
            }
            let createTB =   new ThongBao({
                _id : idTB,
                id_user : id_user,
                id_user_nhan : id_user_duyet,
                id_van_ban : savedDXHH._id,
                type : 2,
                view : 0,
                created_date : createDate
            })
            let saveCreateTb = await createTB.save()
          
            res.status(200).json({savedDXHH,saveCreateTb});
        };
    } catch (error) {
        console.error('Failed to add', error);
        res.status(500).json({error: 'Failed to add'});
    }
}