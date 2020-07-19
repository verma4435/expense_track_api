import mongoose from "mongoose";
import { getEnv } from "../utils/env";

const mongoDb = mongoose.connect(getEnv('mongo_db_uri'), {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set("useCreateIndex", "true");

/**
 * @class BaseModel
 * @classdesc Base Model Class to handle basic function and Mongo DB connection
 */
export default class BaseModel {
    constructor(name, schema) {
        this.connection = mongoose.connection;
        this.name = name;
        this.schema = schema;
        this.model = this.connection.model(this.name, this.schema);
    }

    /**
     * create - function to create a DOC
     * @param  {...any} options 
     */
    async create(...options) {
        return await this.model.create(...options);
    }

    /**
     * find - find function of mongoose
     * @param  {...any} options 
     */
    async find(...options) {
        return await this.model.find(...options);
    }

    /**
     * findOne -  findOne function mongoose 
     * @param  {...any} options 
     */
    async findOne(...options) {
        return await this.model.findOne(...options);
    }

    /**
     * findById - findById function of Mongoose
     * @param  {...any} options 
     */
    async findById(...options) {
        return await this.model.findById(...options);
    }

    /**
     * fucntion to find One and update
     * @param  {...any} options 
     */
    async findOneAndUpdate(...options) {
        return await this.model.findOneAndUpdate(...options)
    }

    /**
     * function to insert many doc
     * @param  {...any} options 
     */
    async insertMany(...options) {
        return await this.model.insertMany(...options);
    }

    /**
     * function to perform aggregate operation
     * @param  {...any} options 
     */
    async aggregate(...options) {
        return await this.model.aggregate(...options);
    }
}