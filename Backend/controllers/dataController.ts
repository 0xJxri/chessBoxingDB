import { Context, Router } from "@oakserver/oak";

interface Params {
    limit?: number;
    orderBy?: string;
    order?: string;
    page?: any;
}

class DataController {
    private db;
    private auth;
    private wasm;
    public router;
    private dataService;

    constructor(db, auth, wasm, dataService) {
        this.db = db;
        this.auth = auth;
        this.wasm = wasm;
        this.dataService = dataService;
        this.router = new Router();
    }

    // Terry is king
    private extractParams(context) {
        const urlSearchParams = context.request.url.searchParams;
        const limit = urlSearchParams.get("limit");
        const orderBy = this.parseOrderBy(urlSearchParams.get("orderBy"));
        const order = urlSearchParams.get("order") || "asc";
        const page = urlSearchParams.get("page") || undefined;
        const search = urlSearchParams.get("search") || undefined;

        let parsedLimit;

        if (limit && /^\d+$/.test(limit)) {
            parsedLimit = parseInt(limit);
        }
        
        if (!parsedLimit) {
            parsedLimit = Infinity;
        }
        return {
            "limit": parsedLimit,
            "orderBy": orderBy,
            "order": order,
            "page": page,
            "search": search
        };
    }

    private parseOrderBy(orderBy) {
        try{
            const orderParts = orderBy.split('=');
            if (orderParts.length === 2) {
                return {
                    [orderParts[0]]: orderParts[1]
                };
            }
        } catch (e) {
            return {};
        }
    }



    public async init() {
        this.router.get("/results", async (context: Context) => {
            const params = this.extractParams(context);
            const response = await this.dataService.fetchData<ResultsDto>('results', params);
            context.response.body = response;
            context.response.status = context.response.body.code;
        });

        this.router.get("/fighterslist", async (context: Context) => {
            const params = this.extractParams(context);
            const response = await this.dataService.fetchData<FightersListDto>('listfighters', params);
            context.response.body = response;
            context.response.status = response.code;
        });

        this.router.get('/events', async (context: Context) => {
            const params = this.extractParams(context);
            const response = await this.dataService.fetchData('events', params);
            context.response.body = response;
            context.response.status = context.response.body.code;
        });

        this.router.get('/detailedfighters', async (context:Context) => {
            const params = this.extractParams(context);
            const response = await this.dataService.fetchData('detailedfighters', params.limit, params.orderBy, params.order, params.page);
            context.response.body = response;
            context.response.status = response.code;
        })

        return this.router.routes();
    }
}

export default DataController;
