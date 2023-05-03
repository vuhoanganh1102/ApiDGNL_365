import { getDataCV, getDataCVUV } from "../controller/addDataCV.js";
import {getData, getDataNew, getDataUpdate, maxID} from "../controller/addata.js";
import express from "express";
const router = express.Router();
router.get('/get-data', getDataUpdate); 
router.get('/get-data-chat', getData); 
router.post('/post-data-max',maxID)
router.get('/get-data-new',getDataNew)
router.get('/get-data-cv',getDataCVUV)
router.get('/get-data-cv-db',getDataCV)
export default router