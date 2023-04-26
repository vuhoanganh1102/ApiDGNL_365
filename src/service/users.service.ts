import {Users} from "../model/users.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {SECRET_KEY} from "../middleware/auth-middleware";

export let ID_USER;

class UsersService {
    register = async (users) => {
        users.password = await bcrypt.hash(users.password, 10);
        return await Users.create(users);
    }
    getToken = async (users) => {
        const usersFind = await Users.findOne({phoneTK: users.phoneTK});
        if (!usersFind) {
            return "Fail";
        } else {
            const comparePassword = await bcrypt.compare(users.password, usersFind.password);
            if (!comparePassword) {
                return "Fail";
            } else {
                const payload = {
                    username: usersFind.userName,
                    idUser: usersFind._id,
                }
                ID_USER = usersFind._id;
                return  jwt.sign(payload, SECRET_KEY, {
                    expiresIn: 36000
                })
            }
        }
    }

}

export default new UsersService();