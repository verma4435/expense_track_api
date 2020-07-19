import express from 'express';
import * as expenseController from "../controller/expense.controller"
import { authUser } from '../utils/middleware';


export function expenseRouter() {
    const router = express.Router();

    //base router for expense
    router.get("/", (req, res) => res.send("jjjjj"));

    //route to create expense
    router.post("/create", authUser, expenseController.create);

    router.get("/calc",authUser, expenseController.calcExpenses);
    return router;
}