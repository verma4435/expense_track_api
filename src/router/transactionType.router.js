import express from 'express';
import * as transactionTypeController from "../controller/transactionType.controller"
import { authUser } from '../utils/middleware';


export function transactionTypeRouter() {
    const router = express.Router();
    //base router for users
    router.get("/list", authUser, transactionTypeController.list);

    //route to register user
    router.post("/create", authUser, transactionTypeController.create);

    //route to register user
    router.patch("/update/:transactionTypeId", authUser, transactionTypeController.update);


    return router;
}