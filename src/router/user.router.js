import express from 'express';
import * as userController from "../controller/user.controller"


export function userRouter() {
    const router = express.Router();

    //base router for users
    router.get("/", (req, res) => res.send("jjjjj"));

    //route to register user
    router.post("/register", userController.create);

    //route to login user
    router.post("/login", userController.login);
    return router;
}