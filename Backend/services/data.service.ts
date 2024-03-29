import Db from "../helpers/db.ts";

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
}

export default DataService;
