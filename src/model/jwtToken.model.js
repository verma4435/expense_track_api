import BaseModel from './base.model';
import jwtTokenSchema from '../schema/jwtToken.schema';
import { JWT_TOKEN_SCHEMA_STR } from '../constants/mongo';
import { isDefined } from '../utils/validation';

/**
 * @class JwtTokenModel
 * @classdesc Model to manipulate JWT Tokens
 */
export default class JwtTokenModel extends BaseModel {
    constructor() {
        super(JWT_TOKEN_SCHEMA_STR, jwtTokenSchema);
    }

    /**
     * createJwtToken - function to create jwt token and store in DB
     * 
     * @author Amit Verma <verma4435@gmail.com>
     * @param {*} tokenInfo 
     * @return Object
     */
    async createJwtToken(tokenInfo) {
        try {
            return await this.create(tokenInfo);
        } catch (err) {
            throw err;
        }
    }

    /**
     * findAllTokenOfUser - function to find all token for a user
     * 
     * @param {*} userObj 
     * @param {*} isActive 
     * @return Object <MongoDB cursor>
     */
    async findAllTokenOfUser(userObj, isActive = 'undefined') {
        try {
            const queryObj = {
                userId: userObj
            }
            if (isDefined(isActive)) {
                queryObj.isActive = isActive;
            }
            return await this.find(queryObj);
        } catch (err) {
            throw err;
        }
    }
}