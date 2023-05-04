import cv from '../../controller/Timviec365/cv.js'
import express from "express";
const router = express.Router();

router.post('/register', cv.RegisterSuccess)

