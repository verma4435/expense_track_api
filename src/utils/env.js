import dotenv from 'dotenv';
dotenv.config();
/**
 * getEnv - function to get all the env variable
 * @param {*} envName 
 */
export function getEnv(envName) {
    try {
        const envVal = process.env[envName.toUpperCase()];
        if(envVal) return envVal;
        throw new Error(`${envName} is not env variable`);
    } catch (err) {
        throw err;
    }
}