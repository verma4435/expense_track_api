/**
 * 
 * -----------------------------
 * 
 *          USER SCHEMA
 *  
 *  Associated with USER MODEL     
 * 
 * ------------------------------ 
 * 
 */

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default userSchema;