/**
 * 
 * -----------------------------
 * 
 *          TRANSACTION_TYPE SCHEMA
 *  
 *  Associated with TRANSACTION_TYPE MODEL     
 * 
 * ------------------------------ 
 * 
 */

import mongoose from 'mongoose';
import { USERS_SCHEMA_STR } from '../constants/mongo';

const transactionTypeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USERS_SCHEMA_STR,
        required: true
    },
    type: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    isActive: {
        type: Boolean,
        require: true,
        default: true
    }
}, { timestamps: true });

export default transactionTypeSchema;


//note:
// set: v => v.toUpperCase() can be use instead of uppercase: true