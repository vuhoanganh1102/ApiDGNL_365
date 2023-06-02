const express = require('express');
var router = express.Router();
const formData = require('express-form-data');

const functions = require('../../services/functions')
const newRN = require('../../controllers/raonhanh365/new');

//api co the tao tat ca cac loai tin
router.post('/postNews/general', formData.parse(), newRN.postNewMain, newRN.postNewsGeneral);

//chia thanh nhieu api tuong ung voi moi mot loai tin
router.post('/postNews/elecDevice', formData.parse(), newRN.postNewMain, newRN.postNewElectron);
router.post('/postNews/vehicle', formData.parse(), newRN.postNewMain, newRN.postNewVehicle);
router.post('/postNews/realEstate', formData.parse(), newRN.postNewMain, newRN.postNewRealEstate);
router.post('/postNews/ship', formData.parse(), newRN.postNewMain, newRN.postNewShip);
router.post('/postNews/enterService', formData.parse(), newRN.postNewMain, newRN.postNewEntertainmentService);
router.post('/postNews/sport', formData.parse(), newRN.postNewMain, newRN.postNewSport);
router.post('/postNews/houseWare', formData.parse(), newRN.postNewMain, newRN.postNewHouseWare);
router.post('/postNews/health', formData.parse(), newRN.postNewMain, newRN.postNewHealth);
router.post('/postNews/job', formData.parse(), newRN.postNewMain, newRN.postNewJob);
router.post('/postNews/food', formData.parse(), newRN.postNewMain, newRN.postNewFood);

router.delete('/deleteAllNews', newRN.deleteAllNews);

router.get('/getNewsBeforeLogin', newRN.getNewsBeforeLogin);
router.get('/searchNews', newRN.searchNews);

module.exports = router;