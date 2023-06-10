const DeXuat = require("../../../models/Vanthu/de_xuat");
const { storageVT } = require('../../../services/functions');
const multer = require('multer');
const functions = require("../../../services/functions");


exports.dxPhongHop = async (req, res) => {
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
            file_kem,
            type_duyet,
            type_time,
            time_start_out,
            time_create,
            time_tiep_nhan,
            time_duyet,
            active,
            del_type,
            bd_hop,
            end_hop,
            ly_do
        } = req.body;
        if(!name_dx || !type_dx || !name_user || !id_user || !id_user_duyet || !id_user_theo_doi){
            return res.status(404).json('bad request')
        }else {
            let maxID = await functions.getMaxID(DeXuat);
            let _id = 0;
            if (maxID) {

                _id = Number(maxID) + 1;
            }
            let createDXPH = new DeXuat({
                _id : _id,
                name_dx: name_dx,
                type_dx: type_dx,
                noi_dung: {
                    phong_hop: {
                        bd_hop: new Date(bd_hop * 1000) ,
                        end_hop : new Date(end_hop * 1000) ,
                        ly_do : ly_do,
                    },
                },
                name_user: name_user,
                id_user: id_user,
                com_id: com_id,
                kieu_duyet: kieu_duyet,
                id_user_duyet: id_user_duyet,
                id_user_theo_doi: id_user_theo_doi,
                file_kem: file_kem,
                type_duyet: type_duyet,
                type_time: type_time,
                time_start_out: time_start_out,
                time_create: time_create,
                time_tiep_nhan: time_tiep_nhan,
                time_duyet: time_duyet,
                active: active,
                del_type: del_type
            });

            let savedDXPH = await createDXPH.save();
            res.status(200).json(savedDXPH);
        };



    } catch (error) {
        console.error('Failed to add', error);
        res.status(500).json({error: 'Failed to add'});
    }
}