/**
 * 
 * -----------------------------
 * 
 *          JWT_TOKEN SCHEMA
 *  
 *  Associated with JWT_TOKEN MODEL     
 * 
 * ------------------------------ 
 * 
 */

import mongoose from 'mongoose';
import {
    USERS_SCHEMA_STR,
} from '../constants/mongo'

const jwtTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USERS_SCHEMA_STR
    },
    token: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default jwtTokenSchema;