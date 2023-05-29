

const router = require('express').Router();
const individualController = require('../../controllers/qlc/individual.controller');

//-----------------------------------API crud-----------------------------------
//API tao moi ca nhan
router.post("/",individualController.createIndividual);

//API lay danh sach tat ca ca nhan hoac lay ra 1 ca nhan theo idQLC;
router.get("/",individualController.getIndividual);



//API thay doi thong tin ca nhan
router.put("/",individualController.editIndividual);

//API xoa ca nhan theo idQLC
router.delete("/", individualController.deleteIndividual);

//-------------------------------API search by fields-------------------------------

//search by experience
router.post("/ind_exp", individualController.getListIndividualByExp);
//by education
router.post("/ind_edu", individualController.getListIndividualByEducation);
//by birthday
router.post("/ind_birthday", individualController.getListIndividualByBirthday);

module.exports = router