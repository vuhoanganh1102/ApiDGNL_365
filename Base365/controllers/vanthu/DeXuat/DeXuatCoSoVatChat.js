const DeXuat = require("../../../models/Vanthu/de_xuat");
const multer = require('multer');
const functions = require('../../../services/vanthu')
const path = require('path');

exports.dxCoSoVatChat = async (req, res) => {
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
            time_start_out,
            input_csv,
            ly_do

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
            let createDXCSVC = new DeXuat({
                _id : _id,
                name_dx: name_dx,
                type_dx: 14,
                noi_dung: {
                    co_so_vat_chat: {
                        input_csv: input_csv ,
                        ly_do :  ly_do,
                    },
                },
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                kieu_duyet: kieu_duyet,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                file_kem: linkDL,
                time_start_out: time_start_out,
                time_create: createDate,
                
            });

            let savedDXCSVC = await createDXCSVC.save();
            let createTB =   new ThongBao({
                _id : _id,
                id_user : id_user,
                id_user_nhan : id_user_duyet,
                id_van_ban : savedDXCSVC._id,
                type : 2,
                view : 0,
                created_date : createDate
            })
            let saveCreateTb = await createTB.save()
          
            res.status(200).json({savedDXCSVC,saveCreateTb});
        };



    } catch (error) {
        console.error('Failed to add', error);
        res.status(500).json({error: 'Failed to add'});
    }
}