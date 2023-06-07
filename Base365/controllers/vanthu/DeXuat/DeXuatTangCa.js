const DeXuat = require("../../../models/Vanthu/de_xuat");
const { storageVT } = require('../../../services/functions');
const multer = require('multer');
const functions = require("../../../services/functions");



// Hiện  tất cả đề xuất
exports.getAllDX = async (req, res) => {
    try {
        const show = await DeXuat.find();
        res.status(200).json(show)
    } catch (error) {
        console.error('Failed to get Dx', error);
        res.status(500).json({ error: 'Failed to get Dx' });
    }
};
//
exports.findByIdUser = async (req,res) => {
    try {
        const findByUserDx = req.body.id_user;
        console.log(findByUserDx)

        const checkUserDx = await DeXuat.findById({id_user : findByUserDx})
        console.log(checkUserDx)
        res.status(200).json(checkUserDx)
    }catch (error) {
        console.error('Failed to find ', error);
        res.status(500).json({ error: 'Failed to find' });
    }
}



//Thêm mới đề xuất tăng ca
exports.dxTangCa = async (req, res) => {
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
                ly_do,
                time_tc,
                time_end_tc
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
                    let createDXTC = new DeXuat({
                        _id : _id,
                        name_dx: name_dx,
                        type_dx: type_dx,
                        noi_dung: {
                            tang_ca: {
                                ly_do: ly_do  ,
                                time_tc: new Date(time_tc * 1000) ,
                                time_end_tc : new Date(time_end_tc * 1000)
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

                let savedDXTC = await createDXTC.save();
                res.status(200).json(savedDXTC);
            };



        } catch (error) {
            console.error('Failed to add', error);
            res.status(500).json({error: 'Failed to add'});
        }
}