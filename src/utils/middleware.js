import { authToken } from "./auth";
import UserModel from "../model/user.model";
import { USER_NOT_FOUND } from "../constants/validationMessage";
let userModel = new UserModel();

export async function authUser(req, res, next) {
    try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const tokenDetail = await authToken(token);
        if (tokenDetail) {
            let user = await userModel.findById(tokenDetail._id);
            if (!user) {
                res.status(404).json({
                    msg: USER_NOT_FOUND
                })
            }

            // delete sensitive data
            user = user.toObject();
            delete user.password;

            req.user = user;
            next();
        }
    } catch (err) {
        next(err);
    }
}