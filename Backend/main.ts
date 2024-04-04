import {
  Application
} from "@oakserver/oak";

import 'dotenv/config'
import UserController from "./controllers/userController.ts";
import ValidationController from "./controllers/validationController.ts";
import AuthHelper from "./helpers/auth.ts";
import Db from "./helpers/db.ts";
import wasmSingleton from "./wasm_helpers.ts";
import DataController from "./controllers/dataController.ts";
import DataService from "./services/data.service.ts";
import * as fs from 'fs/promises';   


const app = new Application();
const mongoConnectionString: any = process.env.MONGO_CONNECTIONSTRING
await wasmSingleton.init();

console.log(wasmSingleton);
// db stuff
const db = new Db(mongoConnectionString); 

// auth stuff
const keyFile: any = await await fs.readFile("./openssl/key.pem", 'utf8');
const auth_rs =  await wasmSingleton.executeForeignConstructor(wasmSingleton.wasmFunctions["jwt_rs"].jwt_rs_methods, keyFile);



const authentication = await new AuthHelper(db, auth_rs, wasmSingleton);
const dataService = await new DataService(db);

// controllers init
const userController = new UserController(db, authentication, wasmSingleton);
const validationController = new ValidationController(db, authentication, wasmSingleton);
const dataController = new DataController(db, authentication, wasmSingleton, dataService)

app.use((ctx, next) => {
  ctx.response.headers.set('Access-Control-Allow-Origin', '*')
  return next()
})

app.use(await userController.init());
app.use(await validationController.init());
app.use(await dataController.init())

console.log("Server running on port 8000");

await app.listen({ port: 8000 });


