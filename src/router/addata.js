import {getData, getDataNew, getDataUpdate, maxID} from "../controller/addata.js";
import express from "express";
const router = express.Router();
router.get('/get-data', getDataUpdate); 
router.get('/get-data-chat', getData); 
router.post('/post-data-max',maxID)
router.get('/get-data-new',getDataNew)
export default router