import {Request, Response} from "express";
import userService from "../service/users.service";

class UsersController {
    register = async (req: Request, res: Response) => {
        try {
            let newUser = req.body;
            if ((newUser.password && newUser.userName && newUser.phoneTK && newUser.city && newUser.district) !== undefined) {
                let user = await userService.register(newUser);
                return res.status(201).json(user)
            } else return res.status(500).json({message: " missing data "})

        } catch (err) {
            return res.status(500).json({message: err.message});
        }

    }
    login = async (req: any, res: Response) => {
        try {
            let account = req.body;
            let token = await userService.getToken(account);
            return res.status(200).json({
                token: token
            })
        } catch (err) {
            return res.status(500).json({message: err.message});

        }

    }
}

export default new UsersController();