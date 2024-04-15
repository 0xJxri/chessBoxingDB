import Db from "../helpers/db.ts";

class DataService {
    private db: Db;

    constructor(client) {
        this.db = client;
    }

    public async fetchData<T>(
        collectionName: string,
        params: any,
    ) {
        try {
            const db = await this.db.getDb();
            const collection = db.collection<T>(collectionName);
            const name = params.fighterName

            let start = 0;
            let end = params.limit;
            var sortOptions = {};
            sortOptions[params.orderBy] = params.order === "asc" ? 1 : -1;
            const searchQuery: any = {};


            if (params.search) {
                const searchParams = params.search.split(';');
                for (const param of searchParams) {
                    const [field, value] = param.split(':');
                    searchQuery[field] = { $regex: `.*${value}.*`, $options: 'i' };
                }
            }


            if (params.fighterName) {
                searchQuery["name"] = { $regex: new RegExp(name, 'i') };//creo na nova regex co l'i option almeno la rendo case insensitive per la query 
            }

            if (params.resultId && params.eventName && params.fightWinDetail) {
                // Apply case insensitive search to the query
                searchQuery["resultId"] = Number(params.resultId);
                searchQuery["eventName"] = { $regex: new RegExp(params.eventName, 'i') };
                searchQuery["fightWinDetail"] = { $regex: new RegExp(params.fightWinDetail, 'i') };
            }

       
            console.log("searchquery", searchQuery)
            console.log(collectionName)

            var data = await collection.find(searchQuery).limit(params.limit).sort(sortOptions).toArray();
            var additionalData: any = {};
            if (params.page) {
                start = 50 * params.page;
                end = start + 50;
                var len = data.length;
                data = data.slice(start, end);
                additionalData = { current: params.page, total: Math.ceil(len / 50) - 1 };

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

public async compareFighters(figherOne, fighterTwo) {
    const db = await this.db.getDb();
    try {
            const fighterOneData = await db.collection("detailedfighters").findOne({ name: figherOne });
            const fighterTwoData = await db.collection("detailedfighters").findOne({ name: fighterTwo });

                const calculateWinPercentage = (fighter) => {
                    const totalFights = fighter.results.reduce((acc, cur) => acc + parseInt(cur), 0);
                    const wins = parseInt(fighter.results[0]);
                    return (wins / totalFights) * 100;
                };

                const fighterOneWinPercentage = calculateWinPercentage(fighterOneData);
                const fighterTwoWinPercentage = calculateWinPercentage(fighterTwoData);

                let winner: any;


                if (fighterOneWinPercentage > fighterTwoWinPercentage) {
                    winner = fighterOneData.name;
                } else if (fighterTwoWinPercentage > fighterOneWinPercentage) {
                    winner = fighterTwoData.name;
                } else {
                    winner = "Tie";
                }

                return {
                    status: "success",
                    message: "Fighters compared",
                    code: 200,
                    percentages: [{ name: fighterOneData.name, percentage: fighterOneWinPercentage }, { name: fighterTwoData.name, percentage: fighterTwoWinPercentage }],
                    winner: winner

                }

            }
    catch (error) { 
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
