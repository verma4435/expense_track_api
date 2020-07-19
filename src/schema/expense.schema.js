/**
 * 
 * -----------------------------
 * 
 *          EXPENSE SCHEMA
 *  
 *  Associated with EXPENSE MODEL     
 * 
 * ------------------------------ 
 * 
 */

import mongoose from 'mongoose';
import {
    USERS_SCHEMA_STR,
    TRANSACTION_TYPE_SCHEMA_STR
} from '../constants/mongo'

const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USERS_SCHEMA_STR,
        required: true
    },
    transactionType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: TRANSACTION_TYPE_SCHEMA_STR,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    transactionDate: {
        type: Date,
        required: true,
        default: new Date()
    }
}, { timestamps: true });

export default expenseSchema;