

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

router.post("/search", individualController.getListIndividualByFields);

module.exports = router