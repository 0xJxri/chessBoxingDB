import Db from "../helpers/db.ts";
import { FightersListDto } from "../dtos/fighters.dto.ts";
import { ResultsDto } from "../dtos/results.dto.ts";

class DataService {
    private db: Db;

    constructor(client) {
        this.db = client;
    }

    public async fetchData<T>(
        collectionName: string,
        limit: number = Infinity,
        orderBy: string = "_id",
        order: string = "asc",
        page: any = undefined
    ) {
        try {
            const db = await this.db.getDb();
            const collection = db.collection<T>(collectionName);
            const sortOptions = {};
            sortOptions[orderBy] = order === "asc" ? 1 : -1;

            let start = 0;
            let end = limit;
            var data = await collection.find().limit(limit).sort(sortOptions).toArray();

            var additionalData:any = {};
            if(page) {
                end = 50 * page;
                var len = data.length;
                data = data.slice(start, end);
                additionalData = {current: page, total: Math.ceil(len / 50)};

            } 

            if (data.length > 0) {
                return {
                    status: "success",
                    message: "Results found",
                    paging: additionalData,
                    code: 200,
                    payload: data
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
