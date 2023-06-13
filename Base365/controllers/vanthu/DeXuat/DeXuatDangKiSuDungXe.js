const DeXuat = require("../../../models/Vanthu/de_xuat");
const { storageVT } = require('../../../services/functions');
const multer = require('multer');
const functions = require('../../../services/vanthu')
const path = require('path');

exports.dxDangKiSuDungXe = async (req, res) => {
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
            bd_xe,
            end_xe,
            soluong_xe,
            local_di,
            local_den,
            ly_do
        } = req.body;
        let createDate = new Date()  
        if(!name_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi){
            return res.status(404).json('bad request')
        }else {
            let file_kem = req.files.file_kem;
            await functions.uploadFileVanThu(id_user, file_kem);
            const imagePath = path.resolve(__dirname, `../Storage/base365/vanthu/tailieu/${id_user}`, file_kem.name);
            const pathString = imagePath.toString();
            console.log(pathString)
            let maxID = await functions.getMaxID(DeXuat);
            let _id = 0;
            if (maxID) {
                _id = Number(maxID) + 1;
            }
            let createDXXe = new DeXuat({
                _id : _id,
                name_dx: name_dx,
                type_dx: 13,
                noi_dung: {
                    xe_cong: {
                        bd_xe: new Date(bd_xe * 1000) ,
                        end_xe : new Date(end_xe * 1000) ,
                        soluong_xe : soluong_xe,
                        local_di : local_di,
                        local_den : local_den,
                        ly_do : ly_do,
                    },
                },
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                kieu_duyet: kieu_duyet,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                file_kem: pathString,
                type_duyet: type_duyet,
                time_create: createDate,
            });

            let savedDXXe = await createDXXe.save();
            res.status(200).json(savedDXXe);
        };



    } catch (error) {
        console.error('Failed to add', error);
        res.status(500).json({error: 'Failed to add'});
    }
}