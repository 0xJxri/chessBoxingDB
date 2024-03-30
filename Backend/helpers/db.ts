import { MongoClient } from "mongodb";

class Db {
    private db: any;

    constructor(host: string) {
        this.connectDb(host);
    }

    private async connectDb(host: string) {
        try {
            const client = await MongoClient.connect(host);
            this.db = client.db(); // Get the database instance
            console.log("Connected to db");
        } catch (error) {
            console.error("Error connecting to database:", error);
        }
    }

    public async getDb() {
        return this.db;
    }
}

export default Db;
