import BaseModel from './base.model';
import userSchema  from '../schema/user.schema';
import { USERS_SCHEMA_STR } from '../constants/mongo';

/**
 * @class UserModel
 * @classdesc Model to handle Users Collection
 */
export default class UserModel extends BaseModel {
    constructor() {
        super(USERS_SCHEMA_STR, userSchema);
    }

    /**
     * createUser - function to create user
     * @param {*} userInfo 
     */
    async createUser(userInfo) {
        try {
            return await this.create(userInfo);
        } catch(err) {
            throw err;
        }
    }
}