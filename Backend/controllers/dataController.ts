import {
    Context,
    Router
} from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { ResultsDto } from "../dtos/results.dto.ts";
import {
    MongoClient
} from "https://deno.land/x/mongo@v0.32.0/mod.ts";


class DataController {
    private db;
    private auth;
    private wasm;
    public router;
    private dataService

    constructor(db, auth, wasm, dataService) {
        this.db = db;
        this.auth = auth;
        this.wasm = wasm;
        this.dataService = dataService
        this.router = new Router();
    }


    public async init() {

        this.router.get("/api/results", async (context: Context) => {
            context.response.body =  await this.dataService.getResults();
            context.response.status = context.response.body.code;
        })
        // TODO fare le rotte   
        return this.router.routes();
    }
}

export default DataController;