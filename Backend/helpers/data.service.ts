import Db from "./db.ts";

class DataService {
    private db: Db;

    constructor(client) {
        this.db = client;
    }

    public async getResults() {
        try {
            const db = await this.db.getDb();
            const resultsCollection = db.collection<ResultsDto>('results');

            // Find all documents in the collection and convert the cursor to an array
            const results = await resultsCollection.find().toArray();

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
