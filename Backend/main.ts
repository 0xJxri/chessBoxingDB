import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs/promises'; // Node.js file system module
import DataController from "./controllers/dataController.ts";
import UserController from "./controllers/userController.ts";
import ValidationController from "./controllers/validationController.ts";
import cors from 'cors'

import AuthHelper from "./helpers/auth.ts";
import Db from "./helpers/db.ts";
import DataService from './services/data.service.ts';
import wasmSingleton from "./wasm_helpers.ts";

dotenv.config();

const app = express();
app.use(cors())
app.use(await bodyParser.json());
app.use(await bodyParser.urlencoded({ extended: true }));

(async () => {
    const mongoConnectionString = process.env.MONGO_CONNECTIONSTRING;
    await wasmSingleton.init();
    const db = new Db(mongoConnectionString); 
    await db.init();



    const keyFile = await fs.readFile("./openssl/key.pem", 'utf8');
    const auth_rs =  await wasmSingleton.executeForeignConstructor(wasmSingleton.wasmFunctions["jwt_rs"].jwt_rs_methods, keyFile);
    const authentication = new AuthHelper(await db.getDb(), auth_rs, wasmSingleton);

    // Initialize controllers
    const validationController = new ValidationController(db, authentication, wasmSingleton);
    const dataController = new DataController(db, authentication, wasmSingleton, new DataService(db));
    const userController = new UserController(db, authentication, wasmSingleton);

    // Initialize routes
    app.use("/", await validationController.init());
    app.use("/", await dataController.init());
    app.use("/", await userController.init());

    // Start the server
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
})();
