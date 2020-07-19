import BaseModel from './base.model';
import transactionTypeSchema from '../schema/transactionType.schema';
import { 
    TRANSACTION_TYPE_SCHEMA_STR 
} from '../constants/mongo';

/**
 * @class TransactionTypeModel
 * @classdesc Model to hangle Transaction Type DOC
 */
export default class TransactionTypeModel extends BaseModel {
    constructor() {
        super(TRANSACTION_TYPE_SCHEMA_STR, transactionTypeSchema);
    }

    /**
     * createTransactionType - function to create Transaction type
     * @param {*} transactionTypeInfo 
     */
    async createTransactionType(transactionTypeInfo) {
        try {
            return await this.create(transactionTypeInfo);
        } catch(err) {
            throw err;
        }
    }

    /**
     * fetchTransactionType - function to create Transaction type
     * @param {*} fetchParams 
     */
    async fetchTransactionType(fetchParams) {
        try{
            return await this.find(fetchParams);
        } catch (err) {
            throw err;
        }
    }
}