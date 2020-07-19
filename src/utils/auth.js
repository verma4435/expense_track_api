import jwt from 'jsonwebtoken';
import { getEnv } from './env';
import JwtTokenModel from '../model/jwtToken.model';
let jwtTokenModel = new JwtTokenModel();

export async function generateToken(userObj, expiresIn = 60 * 60) {
    try {
        //check user has token space as per the requiremen
        await syncTokenOfUser(userObj);
        const token = await jwt.sign(
            { _id: userObj._id },
            getEnv('JWT_SECRET'),
            { expiresIn: expiresIn }
        );
        const tokenData = { userId: userObj, token };
        const tokenCreateStatus = await jwtTokenModel.createJwtToken(tokenData);
        if (!tokenCreateStatus) {
            throw new Error("Token not inserted");
        }
        return token;
    } catch (err) {
        throw err;
    }
}

/**
 * syncTokenOfUser
 * @param {*} userObj 
 */
export async function syncTokenOfUser(userObj) {
    const tokensOfUser = await jwtTokenModel.findAllTokenOfUser(userObj, true);
    tokensOfUser.forEach(tokenObj => {
        try {
            jwt.verify(tokenObj.token, getEnv('jwt_secret'));
        } catch (err) {
            tokenObj.isActive = false;
            tokenObj.save();
        }
    });
}

/**
 * 
 */
export async function authToken(token) {
    try{
        return jwt.verify(token, getEnv('jwt_secret'));
    } catch(err) {
        throw err;
    }
}