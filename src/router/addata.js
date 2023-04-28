import {getData, getDataUpdate} from "../controller/addata.js";
import express from "express";
const router = express.Router();
router.get('/get-data', getDataUpdate); 
router.get('/get-data-chat', getData); 
export default router