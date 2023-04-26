import {Router} from "express";
import UsersController from "../controller/users.controller";
export const usersRouter = Router();
usersRouter.post('/register', UsersController.register);
usersRouter.post('/login', UsersController.login);