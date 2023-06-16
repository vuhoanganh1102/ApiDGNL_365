const DeXuat = require("../../../models/Vanthu/de_xuat");
const { storageVT } = require('../../../services/functions');
const functions = require('../../../services/vanthu')
const path = require('path');
const ThongBao = require("../../../models/Vanthu365/tl_thong_bao")


// const ThongBao = require('../../../models/Vanthu/')
exports.dxCong = async (req, res) => {
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
            ca_xnc,
            time_xnc,
            ly_do
        } = req.body;
        let createDate = new Date()       
        if(!name_dx  || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi){
            return res.status(404).json('bad request')
        }else {
            let file_kem = req.files.file_kem;
            console.log(file_kem);
            await functions.uploadFileVanThu(id_user, file_kem);
            let linkDL =   functions.createLinkFileVanthu(id_user,file_kem.name);
            let maxID = await functions.getMaxID(DeXuat);
            let _id = 0;
            if (maxID) {

                _id = Number(maxID) + 1;
            }
            let createDXC = new DeXuat({
                _id : _id,
                name_dx: name_dx,
                type_dx: 17,
                noi_dung: {
                    xac_nhan_cong: {
                        time_xnc: time_xnc  ,
                        ca_xnc : ca_xnc,
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
                time_create: createDate,
            });
            let savedDXC = await createDXC.save();
            let maxIDTB = await functions.getMaxID(ThongBao)
            let idTB = 0;
            if (maxIDTB) {
                idTB = Number(maxIDTB) + 1;
            }
           let createTB =   new ThongBao({
                _id : idTB,
                id_user : id_user,
                id_user_nhan : id_user_duyet,
                id_van_ban : savedDXC._id,
                type : 2,
                view : 0,
                created_date : createDate
            })
            let saveCreateTb = await createTB.save()
          
            res.status(200).json({savedDXC,saveCreateTb});
        };

    } catch (error) {
        console.error('Failed to add', error);
        res.status(500).json({error: 'Failed to add'});
    }
}

