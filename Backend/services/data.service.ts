import Db from "../helpers/db.ts";

class DataService {
    private db: Db;

    constructor(client) {
        this.db = client;
    }

<<<<<<< HEAD
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

        if(limit == undefined){
            limit = Infinity
        }

        let start = 0;
        let end = limit;
        var sortOptions = {};
        sortOptions[orderBy] = order === "asc" ? 1 : -1;

        var data = await collection.find(orderBy).limit(limit).sort(sortOptions).toArray();
        var additionalData:any = {};
        if(page) {
            start = 50 * page;
            end = start + 50;
            var len = data.length;
            data = data.slice(start, end);
            additionalData = {current: page, total: Math.ceil(len / 50)};

        }

//        if (order == "desc") {
//            data = data.reverse(); // Consider removing this line
//        }

        if (data.length > 0) {
            return {
                status: "success",
                message: "Results found",
                paging: additionalData,
                code: 200,
                payload: data
            };
        } else {
=======
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

            let start = 0;
            let end = limit;

            let sortOrder = (order == "desc") ? -1 : 1;

            var data = await collection.find().sort({ [orderBy]: sortOrder }).limit(limit).toArray();
            console.log(data);

            var additionalData: any = {};
            if (page) {
                start = 50 * page;
                end = start + 50;
                var len = data.length;
                data = data.slice(start, end);
                additionalData = { current: page, total: Math.ceil(len / 50) };

            }

            // if (order == "desc") {
            //     data = data.reverse(); // bruh moment
            // }

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
>>>>>>> a2e147712fa450146cd64f10b23b5f26734a23f6
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
