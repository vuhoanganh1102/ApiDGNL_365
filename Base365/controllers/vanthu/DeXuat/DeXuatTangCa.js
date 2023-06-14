const DeXuat = require("../../../models/Vanthu/de_xuat");
const { storageVT } = require('../../../services/functions');
const multer = require('multer');
const functions = require('../../../services/vanthu')
const path = require('path');
const ThongBao = require("../../../models/Vanthu365/tl_thong_bao")




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
                ly_do,
                time_tc,
                time_end_tc
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
                    let createDXTC = new DeXuat({
                        _id : _id,
                        name_dx: name_dx,
                        type_dx: 10,
                        noi_dung: {
                            tang_ca: {
                                ly_do: ly_do  ,
                                time_tc: time_tc  ,
                                time_end_tc : time_end_tc
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

                let savedDXTC = await createDXTC.save();
                let maxIDTB = await functions.getMaxID(ThongBao)
                let idTB = 0;
                if (maxIDTB) {
                    idTB = Number(maxIDTB) + 1;
                }
                let createTB =   new ThongBao({
                    _id : idTB,
                    id_user : id_user,
                    id_user_nhan : id_user_duyet,
                    id_van_ban : savedDXTC._id,
                    type : 2,
                    view : 0,
                    created_date : createDate
                })
                let saveCreateTb = await createTB.save()
              
                res.status(200).json({savedDXTC,saveCreateTb});
            };



        } catch (error) {
            console.error('Failed to add', error);
            res.status(500).json({error: 'Failed to add'});
        }
}