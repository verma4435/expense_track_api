import express from 'express';
import bodyParser from "body-parser";
import { getEnv } from './utils/env';
import { baseRouter } from './router';

//app setup with express
const app = express();
const port = getEnv('port');

//bodyParser setup
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//base router setup
app.use("/", baseRouter());
//app server setup
app.listen(port, () => {
    console.log("Listening to port : %d", port);
});