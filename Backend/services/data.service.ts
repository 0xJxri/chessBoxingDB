import Db from "../helpers/db.ts";
import { FightersListDto } from "../dtos/fighters.dto.ts";
import { ResultsDto } from "../dtos/results.dto.ts";

class DataService {
    private db: Db;

    constructor(client) {
        this.db = client;
    }

    public async getResults(limit: number = Infinity) {
        try {
            const db = await this.db.getDb();
            const resultsCollection = db.collection<ResultsDto>('results');

            const results = await resultsCollection.find().limit(limit).toArray();

            if (results.length > 0) {
                return {
                    status: "success",
                    message: "Results found",
                    code: 200,
                    payload: results
                };
            } else {
                return {
                    status: "error",
                    message: "Results not found",
                    code: 404,
                    payload: null
                };
            }
        } catch (error) {
            console.error("Error fetching results:", error);
            return {
                status: "error",
                message: "Internal server error",
                code: 500,
                payload: null
            };
        }
    }

    public async getFightersList(limit: number = Infinity, orderBy: string = "name", order: string = "asc") {
        try {
            const db = await this.db.getDb();
            const listFightersCollection = db.collection<FightersListDto>('listfighters');

            const sortOptions = {};
            sortOptions[orderBy] = order === "asc" ? 1 : -1;

            const fighters = await listFightersCollection.find().limit(limit).sort(sortOptions).toArray();

            if (fighters.length > 0) {
                return {
                    status: "success",
                    message: "Results found",
                    code: 200,
                    payload: fighters
                };
            } else {
                return {
                    status: "error",
                    message: "Results not found",
                    code: 404,
                    payload: null
                };
            }
        } catch (error) {
            console.error("Error fetching results:", error);
            return {
                status: "error",
                message: "Internal server error",
                code: 500,
                payload: null
            };
        }
    }
}




export default DataService;
