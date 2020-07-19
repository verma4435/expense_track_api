import TransactionTypeModel from '../model/transactionType.model';
import {
    TRANSACTION_TYPE_CREATED,
    NO_CONTENT_FOUND,
    TRANSACTION_TYPE_ALREADY_EXISTS
} from "../constants/validationMessage";
import {
    HTTP_CREATED,
    HTTP_OK,
    HTTP_BAD_REQUEST,
    NO_CONTENT
} from "../constants/httpStatus";


let transactionTypeModel = new TransactionTypeModel();

/**
 * create  -  function to create a transaction type
 * @param {*} req 
 * @param {*} res 
 */
export async function create(req, res) {
    try {
        const transactionTypeInfo = req.body;
        transactionTypeInfo.userId = req.user;

        const checkTransactionTypeExists = await transactionTypeModel.fetchTransactionType(transactionTypeInfo);

        if (checkTransactionTypeExists.length) {
            return res.status(HTTP_BAD_REQUEST).json({
                message: TRANSACTION_TYPE_ALREADY_EXISTS,
                data: transactionTypeInfo
            })
        }

        const transactionTypeCreateStatus = await transactionTypeModel.createTransactionType(transactionTypeInfo);

        return res.status(HTTP_CREATED).json({
            message: TRANSACTION_TYPE_CREATED,
            data: transactionTypeCreateStatus
        })
    } catch (error) {
        throw error;
    }
}

/**
 * list - function to list all the expense list
 * @param {*} req 
 * @param {*} res 
 */
export async function list(req, res) {
    try {
        const queryParam = req.query;
        queryParam.userId = req.user;

        const transactionTypeList = await transactionTypeModel.fetchTransactionType(queryParam);

        if (!transactionTypeList || !transactionTypeList.length) {
            return res.status(NO_CONTENT).json({
                message: NO_CONTENT_FOUND,
                data: []
            });
        }

        return res.status(HTTP_OK).json({
            data: transactionTypeList
        })

    } catch (error) {
        throw error;
    }
}

/**
 * update - function to update the transaction type
 * @param {*} req 
 * @param {*} res 
 */
export async function update(req, res) {
    try {
        const transactionTypeId = req.params.transactionTypeId;
        const updateData = req.body;
        const updateStatus = await transactionTypeModel.findOneAndUpdate({ _id: transactionTypeId }, updateData, { new: true });

        if(!updateStatus) {
            return res.status(HTTP_BAD_REQUEST).json({
                message: "Something went wrong",
                data: updateData
            });
        }

        return res.status(HTTP_OK).json({
            data: updateStatus
        });

    } catch (err) {
        throw err;
    }
}