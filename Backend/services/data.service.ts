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

            if (params.date && params.eventName && params.fighterWhite && params.fighterBlack) {

                searchQuery["dateFormat"] = { $regex: new RegExp(params.date, 'i') };
                searchQuery["eventName"] = { $regex: new RegExp(params.eventName, 'i') };
                searchQuery["fighterWhite.Name"] = { $regex: new RegExp(params.fighterWhite, 'i') };
                searchQuery["fighterBlack.Name"] = { $regex: new RegExp(params.fighterBlack, 'i') };
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
                additionalData = { current: params.page, total: Math.ceil(len / 50)  };

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

public async compareFighters(fighterOne, fighterTwo) {
    const db = await this.db.getDb();
    try {
        var fighterOneData = await db.collection("detailedfighters").findOne({ name: fighterOne });
        var fighterTwoData = await db.collection("detailedfighters").findOne({ name: fighterTwo });

        const calculateWinPercentage = (fighter) => {
            let totalWins = 0;
            let totalMatches = 0;
            fighter.results.forEach((result) => {
                const resultInt = parseInt(result);
                if (!isNaN(resultInt)) {
                    totalMatches++;
                    if(resultInt >= 1) {
                        totalWins++;

                    }
                }
            });
            if (totalMatches === 0) return 0;
            const winPercentage = (totalWins / totalMatches) * 100;
            return winPercentage >= 0 ? winPercentage : 0;
        };

        const fighterOneWinPercentage = calculateWinPercentage(fighterOneData);
        const fighterTwoWinPercentage = calculateWinPercentage(fighterTwoData);

        let winner = "Tie";

        if ( fighterOneWinPercentage > fighterTwoWinPercentage) {
            winner = fighterOneData.name;
        } else if (fighterTwoWinPercentage > fighterOneWinPercentage) {
            winner = fighterTwoData.name;
        }

        
        const extrasFighterOne = await db.collection("detailedfighters").findOne({ name: fighterOne });
        const extrasFighterTwo = await db.collection("detailedfighters").findOne({ name: fighterTwo }); 

        fighterOneData = {
            ...fighterOneData,
            ...extrasFighterOne
        };
        console.log(fighterOneData);
        fighterTwoData = {
            ...fighterTwoData,
            ...extrasFighterTwo
        };


        return {
            code: 200,
            status: "success",
            payload: {
                winner: winner,
                fighterWhite: {
                    name: fighterOneData.name,
                    percentage: fighterOneWinPercentage,
                    flag: fighterOneData.flag,
                    results: fighterOneData.results,
                    pfp_link: fighterOneData.pfp_link,
                    age: fighterOneData.age,
                    height: fighterOneData.height,
                    weight: fighterOneData.weight,
                    reach: fighterOneData.reach,
                    elo: fighterOneData.elo,
                    country: fighterOneData.country,
                    hometown: fighterOneData.hometown,
                    gym: fighterOneData.gym,
                    job: fighterOneData.job,
                },
                fighterBlack: {
                    name: fighterTwoData.name,
                    percentage: fighterTwoWinPercentage,
                    flag: fighterTwoData.flag,
                    results: fighterTwoData.results,
                    pfp_link: fighterTwoData.pfp_link,
                    age: fighterTwoData.age,
                    height: fighterTwoData.height,
                    weight: fighterTwoData.weight,
                    reach: fighterTwoData.reach,
                    elo: fighterTwoData.elo,
                    country: fighterTwoData.country,
                    hometown: fighterTwoData.hometown,
                    gym: fighterTwoData.gym,
                    job: fighterTwoData.job,
                }
            }
        };
    } catch (error) {
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
