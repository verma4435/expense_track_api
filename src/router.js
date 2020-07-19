import express from 'express';
import { userRouter } from './router/user.router';
import { expenseRouter } from './router/expense.router';
import { transactionTypeRouter } from './router/transactionType.router';

export function baseRouter() {
    let router = express.Router();

    //router to handle request for user
    router.use("/users", userRouter());

    //router to handle request for user
    router.use("/expenses", expenseRouter());

    //todo: move this routes to admin router or permission
    router.use("/transactionTypes",transactionTypeRouter());
    

    //router to handle undefinded router
    router.all("*", (req, res) => {
        res.status(404).json({
            message: "Bad Request"
        })
    })
    return router;
}