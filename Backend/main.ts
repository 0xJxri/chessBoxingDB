import {
  Application
} from "https://deno.land/x/oak@v12.4.0/mod.ts";

import { load } from "https://deno.land/std@0.221.0/dotenv/mod.ts";
import UserController from "./controllers/userController.ts";
import ValidationController from "./controllers/validationController.ts";
import AuthHelper from "./helpers/auth.ts";
import Db from "./helpers/db.ts";
import wasmSingleton from "./wasm_helpers.ts";
import DataController from "./controllers/dataController.ts";
import DataService from "./services/data.service.ts";

const app = new Application();
const env = await load()
const mongoConnectionString = env.MONGO_CONNECTIONSTRING
// wasm
await wasmSingleton.init();

// db stuff
const db = new Db(mongoConnectionString); // mi serve una connection string per mongo

// auth stuff
const keyFile = await Deno.readFile("./openssl/key.pem");
const keyString = new TextDecoder().decode(keyFile);
const auth_rs =  await wasmSingleton.executeForeignConstructor(wasmSingleton.wasmFunctions["jwt_rs"].jwt_rs_methods, keyString);



const authentication = await new AuthHelper(db, auth_rs, wasmSingleton);
const dataService = await new DataService(db);

// controllers init
const userController = new UserController(db, authentication, wasmSingleton);
const validationController = new ValidationController(db, authentication, wasmSingleton);
const dataController = new DataController(db, authentication, wasmSingleton, dataService)


app.use(await userController.init());
app.use(await validationController.init());
app.use(await dataController.init())



console.log("Server running on port 8000");

await app.listen({ port: 8000 });


