const DeXuat = require("../../../models/Vanthu/de_xuat");
const { storageVT } = require('../../../services/functions');
const multer = require('multer');
const functions = require("../../../services/functions");


exports.dxThanhToan = async (req, res) => {
    try {
        let {
            name_dx,
            type_dx,
            noi_dung,
            name_user,
            id_user,
            kieu_duyet,
            com_id,
            id_user_duyet,
            id_user_theo_doi,
            type_duyet,
            type_time,
            time_start_out,
            time_create,
            time_tiep_nhan,
            time_duyet,
            active,
            del_type,
            so_tien_tt,
            ly_do
        } = req.body;
        if(!name_dx || !type_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi){
            return res.status(404).json('bad request')
        }else {
            let file_kem = req.files.file_kem
            functions.uploadVanthuDeXuat(id_user,file_kem)
            const imagePath = path.resolve(__dirname,`../Storage/base365/vanthu/tailieu/${id_user}` , file_kem.name);
            const pathString = imagePath.toString();
            console.log(pathString)
            let maxID = await functions.getMaxID(DeXuat);
            let _id = 0;
            if (maxID) {

                _id = Number(maxID) + 1;
            }
            let createDXTT = new DeXuat({
                _id : _id,
                name_dx: name_dx,
                type_dx: type_dx,
                noi_dung: {
                    thanh_toan: {
                        so_tien_tt: so_tien_tt ,
                        ly_do : ly_do,
                    },
                },
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                kieu_duyet: kieu_duyet,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                file_kem : pathString,
                type_duyet: type_duyet,
                type_time: type_time,
                time_start_out: time_start_out,
                time_create: time_create,
                time_tiep_nhan: time_tiep_nhan,
                time_duyet: time_duyet,
                active: active,
                del_type: del_type
            });

            let savedDXTT = await createDXTT.save();
            res.status(200).json(savedDXTT);
        };



    } catch (error) {
        console.error('Failed to add', error);
        res.status(500).json({error: 'Failed to add'});
    }
}