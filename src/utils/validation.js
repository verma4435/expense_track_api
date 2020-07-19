/**
 * isDefined | function to check the variable is defined or not
 * 
 * @author Amit Verma <verma4435@gmail.com>
 * @param {*} variable
 * @return Boolean 
 */
export const isDefined = variable => typeof variable !== 'undefined' || variable !== undefined;


export const isObject = obj => (typeof obj === 'object' || typeof obj === "function") && obj !== null;