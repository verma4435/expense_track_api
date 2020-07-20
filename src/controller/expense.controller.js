import ExpenseModel from "../model/expense.model";
import TransactionTypeModel from "../model/transactionType.model";
import {
    EXPENSE_CREATED
} from "../constants/validationMessage";
import {
    HTTP_CREATED,
    HTTP_OK,
    HTTP_BAD_REQUEST,
    NO_CONTENT
} from "../constants/httpStatus";
import { isDefined } from "../utils/validation";
import {
	MONGO_SORT_ASC,
	MONGO_SORT_DESC,
	sortOrderAscArr
} from "../constants/mongo.js";

let transactionTypeModel = new TransactionTypeModel();
let expenseModel = new ExpenseModel();

/**
 * create - function to create a expense
 * @param {*} req 
 * @param {*} res 
 * @author Amit Verma <verma4435@gmail.com>
 */
export async function create(req, res) {
    try {
        const expenseInfo = req.body;
        expenseInfo.userId = req.user;
        expenseInfo.transactionType = await transactionTypeModel.findOne({ type: expenseInfo.transactionType });
        const expenseCreateStatus = await expenseModel.createExpense(expenseInfo);

        return res.status(HTTP_CREATED).json({
            message: EXPENSE_CREATED,
            data: expenseCreateStatus
        })
    } catch (error) {
        throw error;
    }
}

/**
 * calcExpenses - function to cal the expenses
 * @param {*} req 
 * @param {*} res 
 */
export async function calcExpenses(req, res) {
    try {
        const queryParam = req.query;
        queryParam.user = req.user;

        // checking transaction type is present in request
        if (isDefined(queryParam.transactionType)) {
            if(queryParam.transactionType != 'all') {
                queryParam.transactionType = await transactionTypeModel.findOne({
                    userId: req.user,
                    type: queryParam.transactionType
                });
            }
        }

        // sorting of data
        let sortOrder = MONGO_SORT_DESC;
        if (isDefined(queryParam.sortOrder)) {
            if (sortOrderAscArr.find(e => e == queryParam.sortOrder.toUpperCase())) {
                sortOrder = MONGO_SORT_ASC;
            }
        }

        //setting sortOrder in query Param
        queryParam.sortOrder = sortOrder;

        // expense calculation call
        const calcExpense = await expenseModel.calcExpenses(queryParam);

        if (!calcExpense) {
            return res.status(NO_CONTENT);
        }

        // response with calc data
        return res.status(HTTP_OK).json({
            message: "Calculation Result",
            calc: calcExpense
        });
    } catch (err) {
        throw err;
    }
}
