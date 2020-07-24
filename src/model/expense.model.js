import BaseModel from './base.model';
import expenseSchema from '../schema/expense.schema';
import { EXPENSES_SCHEMA_STR } from '../constants/mongo';
import { isDefined } from '../utils/validation';
import { mongoQueryDate } from '../utils/date';
import { DocumentProvider } from 'mongoose';

/**
 * @class ExpenseModel
 * @classdesc Model to handle Expense DOC
 */
export default class ExpenseModel extends BaseModel {
    constructor() {
        super(EXPENSES_SCHEMA_STR, expenseSchema);
    }

    /**
     * createExpense - function to create a expense DOC
     * @param {*} expenseInfo 
     */
    async createExpense(expenseInfo) {
        try {
            return await this.create(expenseInfo);
        } catch (err) {
            throw err;
        }
    }

    /**
     * calcExpenses - function to calc expenese
     * @param {*} queryParams 
     */
    async calcExpenses(queryParams) {

        try {
            /** intialization for all the aggregate constants*/
            let isDateQuery = false;
            let isTransactionTypeQuery = false;
            let isLookUpQuery = false;
            let	sortingField = 'totalAmount';
            const aggregateMainParam = [];
            const aggregateMatchParam = {};
			const sortFieldObj = {};
            const aggregatGroupByParam = {};
            const aggregateProject = {};
            aggregatGroupByParam._id = {};

            aggregateMatchParam.userId = queryParams.user._id;

            if (isDefined(queryParams.date) && isDefined(queryParams.isCumulative) && !Number(queryParams.isCumulative)) {
                isDateQuery = true;
                /** match with date */
                const matchDate = mongoQueryDate(queryParams.date);
                aggregateMatchParam.transactionDate = matchDate.mongoDateComparsionObj;

				sortingField = 'date';
                /** group by date */
                aggregatGroupByParam._id.date = {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$transactionDate",
                        timezone: "Asia/Kolkata"
                    }
                };
            }

            /** match params for aggregate function */
            if (isDefined(queryParams.transactionType)) {
                if(queryParams.transactionType != 'all') {
                    aggregateMatchParam.transactionType = queryParams.transactionType._id;
                }
                isTransactionTypeQuery = true;
            }

            /** make group by transaction type */
            if (!isDateQuery || isTransactionTypeQuery) {
                aggregatGroupByParam._id.transactionType = "$transactionType";
                isLookUpQuery = true;
            }
            /** adding the aggreate functions */
            aggregatGroupByParam.totalAmount = { $sum: "$amount" };
            aggregatGroupByParam.min = { $min: "$amount" };
            aggregatGroupByParam.max = { $max: "$amount" };
            aggregatGroupByParam.avg = { $avg: "$amount" };

            // todo: make item push only for days 
            // aggregatGroupByParam.items = {
            //     $push: {
            //         amount: "$amount",
            //         transactionDate: {
            //             $dateToString: {
            //                 format: "%Y-%m-%d %H:%M:%S",
            //                 date: "$transactionDate",
            //                 timezone: "Asia/Kolkata"
            //             }
            //         },
            //     }
            // };

            /** project pipeline intialization */
            aggregateProject._id = 0;
            aggregateProject.totalAmount =  1;
            aggregateProject.min = 1;
            aggregateProject.max = 1;
            aggregateProject.avg = 1;
            aggregateProject.date = "$_id.date";
           
            /** match pipeline of aggregate */
            aggregateMainParam.push({ $match: aggregateMatchParam });

            /** group pipeline of aggregate */
            aggregateMainParam.push({ $group: aggregatGroupByParam });

            /** lookup pipeline of aggregate */
            if (isLookUpQuery) {
                aggregateProject.transactionType = "$transactionType.type";

                aggregateMainParam.push({ 
                    $lookup: { 
                        from: "transactiontypes", 
                        localField: "_id.transactionType", 
                        foreignField: "_id", 
                        as: "transactionType" 
                    } 
                });
    
                /** unwind pipeline of aggregate */
                aggregateMainParam.push({$unwind:"$transactionType"});
            }

            /** project pipeline of aggregate */
            aggregateMainParam.push({ $project: aggregateProject })

            /** sort pipeline of aggregate */
			sortFieldObj[sortingField] = queryParams.sortOrder;
            aggregateMainParam.push({ $sort: sortFieldObj });
	    return await this.aggregate(aggregateMainParam);
        } catch (err) {
            throw err;
        }
    }
}


