const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
const dotenv = require("dotenv");
dotenv.config();

exports.checkToken = (req, res, next) => {
    const token = req.headers["access-token"];
    if (!token) {
        return res.status(401).json({ message: "Missing token" });
    }
    jwt.verify(token, process.env.NODE_SERCET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.userId = decoded.data._id;
        next();
    });
};

exports.isCompany = (req, res, next)=>{
  let userId = req.userId;
    const company = Users.find({idQLC: userId});
    if(company){
        next();
        return;
    }
    return res.status(403).json({ message: "is not company" });
}