import UserModel from "../model/user.model";
import { generateToken } from "../utils/auth";
import {
    USER_CREATED,
    USER_EXIST,
    USER_FOUND
} from "../constants/validationMessage";
import {
    HTTP_CREATED,
    HTTP_OK,
    HTTP_BAD_REQUEST
} from "../constants/httpStatus";
import TransactionTypeModel from "../model/transactionType.model";
import { defaultTransactionTypeArr } from "../constants/appConstants";

let userModel = new UserModel();
let transactionTypeModel = new TransactionTypeModel();
/**
 * create the user data
 * @param {*} req 
 * @param {*} res 
 */
export async function create(req, res) {
    try {
        const userObj = req.body;

        //CHECK USER EXISTS OR NOT
        const checkUserExist = await userModel.findOne({ username: userObj.username.toLowerCase() });
        if (checkUserExist) {
            return res.status(HTTP_OK).json({
                message: USER_EXIST,
                data: userObj.username
            });
        }

        //if user not exist then create a user
        const userCreateStatus = await userModel.createUser(userObj);

        // if user is not created
        if (!userCreateStatus) {
            return res.status(HTTP_BAD_REQUEST).json({
                message: 'Something went wrong'
            });
        }

        // TODO: make the creation of transaction type by
        // triggers
        // code to create default transaction type
        
        await transactionTypeModel.insertMany(defaultTransactionTypeArr.map(defaultType=>{
            return {
                userId: userCreateStatus._id,
                type: defaultType
            }
        }));


        //delete sensitive data
        const userData = userCreateStatus.toObject();
        delete userData.password;

        //return the response with user created
        return res.status(HTTP_CREATED).json({
            message: USER_CREATED,
            data: userData
        });
    } catch (error) {
        throw error;
    }
}

/**
 * login function for user 
 */
export async function login(req, res) {
    try {
        const userCredentials = req.body;

        //check user present in DB
        let isUserExists = await userModel.findOne({ username: userCredentials.username.toLowerCase() });
        if (isUserExists) {
            if (isUserExists.password == userCredentials.password) {

                //convert mongoObj to JS object
                let userData = isUserExists.toObject();
                delete userData.password;
                req.user = userData;

                //return user data with token
                return res.status(HTTP_OK).json({
                    message: USER_FOUND,
                    data: req.user,
                    token: await generateToken(isUserExists)
                });
            } else {
                return res.status(HTTP_BAD_REQUEST).json({
                    data: userCredentials
                });
            }
        } else {
            return res.status(HTTP_BAD_REQUEST).json({
                data: userCredentials
            });
        }
    } catch (err) {
        throw err;
    }
}