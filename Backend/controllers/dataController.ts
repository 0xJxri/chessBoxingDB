import { Router } from 'express';

interface Params {
    limit?: number;
    orderBy?: string;
    order?: string;
    page?: any;
    fighterName?: string;
    resultId?: number;
    eventName?: string;
    fightWinDetail?: string;
    date?: string;
    fighterWhite?: string;
    fighterBlack?: string;
}


/**
 * @typedef {Object} Params - Object representing optional query parameters
 * @property {number} [limit] - Limit number of results
 * @property {string} [orderBy] - Field to order results by
 * @property {string} [order] - Order of sorting (asc or desc)
 * @property {any} [page] - Page number for pagination
 * @property {string} [fighterName] - Name of the fighter
 * @property {number} [resultId] - ID of the result
 * @property {string} [eventName] - Name of the event
 * @property {string} [fightWinDetail] - Fight win detail
 * @property {string} [date] - Date of the event
 * @property {string} [fighterWhite] - Name of the white fighter
 * @property {string} [fighterBlack] - Name of the black fighter
 */

/**
 * @typedef {Object} ResponseBody - Response body structure
 * @property {string} status - Status of the response
 * @property {string} message - Message explaining the status
 * @property {number} code - HTTP status code
 * @property {any} payload - Data payload
 */

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
        const urlSearchParams = req.query;
        const limit = urlSearchParams.limit ? parseInt(urlSearchParams.limit) : Infinity;
        const orderBy = urlSearchParams.orderBy || "name";
        const order = urlSearchParams.order || "asc";
        const page = urlSearchParams.page || undefined;
        const search = urlSearchParams.search || undefined;
        const fighterName = req.params.fighterName || undefined;
        const resultId = urlSearchParams.resultId ? parseInt(urlSearchParams.resultId) : undefined;
        const eventName = urlSearchParams.eventName || undefined;
        const fightWinDetail = urlSearchParams.fightWinDetail || undefined;
        const date = urlSearchParams.date || undefined;
        const fighterWhite = urlSearchParams.fighterWhite || undefined;
        const fighterBlack = urlSearchParams.fighterBlack || undefined;

        return {
            limit,
            orderBy,
            order,
            page,
            search,
            fighterName,
            resultId,
            eventName,
            fightWinDetail,
            date,
            fighterWhite,
            fighterBlack
        };
    }

    init() {

/**
 * @swagger
 * /results:
 *   get:
 *     summary: Retrieve results
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit number of results
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *         description: Field to order results by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: Order of sorting (asc or desc)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: fighterName
 *         schema:
 *           type: string
 *         description: Name of the fighter
 *       - in: query
 *         name: resultId
 *         schema:
 *           type: integer
 *         description: ID of the result
 *       - in: query
 *         name: eventName
 *         schema:
 *           type: string
 *         description: Name of the event
 *       - in: query
 *         name: fightWinDetail
 *         schema:
 *           type: string
 *         description: Fight win detail
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Date of the event
 *       - in: query
 *         name: fighterWhite
 *         schema:
 *           type: string
 *         description: Name of the white fighter
 *       - in: query
 *         name: fighterBlack
 *         schema:
 *           type: string
 *         description: Name of the black fighter
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema: {}
 */


/**
 * @swagger
 * /fighterslist:
 *   get:
 *     summary: Retrieve list of fighters
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit number of results
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *         description: Field to order results by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: Order of sorting (asc or desc)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: fighterName
 *         schema:
 *           type: string
 *         description: Name of the fighter
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema: {}
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Retrieve list of events
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit number of results
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *         description: Field to order results by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: Order of sorting (asc or desc)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: eventName
 *         schema:
 *           type: string
 *         description: Name of the event
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema: {}
 */

/**
 * @swagger
 * /detailedfighters/{fighterName}:
 *   get:
 *     summary: Retrieve detailed information of a fighter
 *     parameters:
 *       - in: path
 *         name: fighterName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the fighter
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema: {}
 */

/**
 * @swagger
 * /fightdetails:
 *   get:
 *     summary: Retrieve details of fights
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit number of results
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *         description: Field to order results by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: Order of sorting (asc or desc)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema: {}
 */

/**
 * @swagger
 * /compare:
 *   post:
 *     summary: Compare two fighters
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fighterOne:
 *                 type: string
 *                 description: Name of the first fighter
 *               fighterTwo:
 *                 type: string
 *                 description: Name of the second fighter
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema: {}
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema: {}
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema: {}
 */



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
            console.log(response);
            res.status(response.code).json(response);
        });

        this.router.get('/detailedfighters/:fighterName', async (req, res) => {
            const params = this.extractParams(req);
            const response = await this.dataService.fetchData('detailedfighters', params);
            res.status(response.code).json(response);
        });

        this.router.get('/fightdetails', async (req, res) => {
            const params = this.extractParams(req);
            const response = await this.dataService.fetchData('fightdetails', params);
            res.status(response.code).json(response);
        })

        this.router.post('/compare', async (req, res) => {
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
