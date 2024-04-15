import { Router } from 'express';

interface Params {
    limit?: number;
    orderBy?: string;
    order?: string;
    page?: any;
}

class DataController {
    private db: any;
    private auth: any;
    private wasm: any;
    private dataService: any;
    public router;

    constructor(db, auth, wasm, dataService) {
        this.db = db;
        this.auth = auth;
        this.wasm = wasm;
        this.dataService = dataService;
        this.router = Router();
        this.init();
    }

    // Terry is king
    private extractParams(req) {
        const limit = req.query.limit ? parseInt(req.query.limit) : Infinity;
        const orderBy = req.query.orderBy || "name";
        const order = req.query.order || "asc";
        const page = req.query.page || undefined;
        const search = req.query.search || undefined;
    
        return {
            limit,
            orderBy,
            order,
            page,
            search
        };
    }

    init() {
        this.router.get("/results", async (req, res) => {
            const params = this.extractParams(req);
            const response = await this.dataService.fetchData('results', params);
            res.status(response.code).json(response);
        });

        this.router.get("/fighterslist", async (req, res) => {
            const params = this.extractParams(req);
            const response = await this.dataService.fetchData('listfighters', params);
            res.status(response.code).json(response);
        });

        this.router.get('/events', async (req, res) => {
            const params = this.extractParams(req);
            const response = await this.dataService.fetchData('events', params);
            res.status(response.code).json(response);
        });

        this.router.get('/detailedfighters', async (req, res) => {
            const params = this.extractParams(req);
            const response = await this.dataService.fetchData('detailedfighters', params.limit, params.orderBy, params.order, params.page);
            res.status(response.code).json(response);
        });
    
    this.router.get('/compare', async (req, res) => {
        try {
            let jwt = await this.auth.authorized(req);
    
            if (jwt) {
                const fighterOne = req.body.fighterOne;
                const fighterTwo = req.body.fighterTwo;
    
                const response = await this.dataService.compareFighters(fighterOne, fighterTwo);
                res.status(response.code).json(response);
            } else {
                res.status(401).json({
                    status: "error",
                    message: "User is not authorized",
                    code: 401,
                    payload: null
                });
            }
        } catch (error) {
            console.error("Error occurred:", error);
            res.status(500).json({
                status: "error",
                message: "Internal Server Error",
                code: 500,
                payload: null
            });
        }
    });



        return this.router;
    }

}

export default DataController;
