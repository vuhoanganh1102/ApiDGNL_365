import {Router} from "express";
import {usersRouter} from "./users.router";
export const router = Router();
router.use('/accounts', usersRouter);