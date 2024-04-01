import {
    Context,
    Router
} from "@oakserver/oak";


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

            response = await this.dataService.fetchData<ResultsDto>('results', parsedLimit, 'timestamp', 'desc');
            context.response.body = response;
            context.response.status = context.response.body.code;
        });

     
        this.router.get("/fighterslist", async (context: Context) => {
            const limit = context.request.url.searchParams.get("limit");
            const orderBy = context.request.url.searchParams.get("orderBy") || "name";
            const orderAscDesc = context.request.url.searchParams.get("order") || "asc";

            let parsedLimit = Infinity;

            if (limit && /^\d+$/.test(limit)) {
                parsedLimit = parseInt(limit);
            }

            const response = await this.dataService.fetchData<FightersListDto>('listfighters', parsedLimit, orderBy, orderAscDesc);
            context.response.body = response;
            context.response.status = response.code;
        });
        return this.router.routes();
    }

    
}


export default DataController;