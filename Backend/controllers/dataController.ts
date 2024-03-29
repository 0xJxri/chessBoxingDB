import {
    Context,
    Router
} from "https://deno.land/x/oak@v12.4.0/mod.ts";


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

        this.router.get("/results", async (context: Context) => {
            const limit = context.request.url.searchParams.get("limit");
            let response;
            let parsedLimit = Infinity;

            if (limit && /^\d+$/.test(limit)) {
                parsedLimit = parseInt(limit);
            }

            response = await this.dataService.getResults(parseInt(limit));
            context.response.body = response;
            context.response.status = context.response.body.code;
        });

        return this.router.routes();
    }
}


export default DataController;