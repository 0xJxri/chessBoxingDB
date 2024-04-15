import { MongoClient } from "mongodb";

class Db {
    private db: any;

    constructor(private host: string) {}

    public async init() {
        try {
            await this.connectDb();
            console.log("Initialization complete");
        } catch (error) {
            console.error("Initialization failed:", error);
            throw error; // Rethrow the error to handle it elsewhere if needed
        }
    }

    private async connectDb() {
        try {
            const client = await MongoClient.connect(this.host);
            this.db = client.db(); // Get the database instance
            console.log("Connected to db");
        } catch (error) {
            console.error("Error connecting to database:", error);
            throw error; // Rethrow the error to handle it elsewhere if needed
        }
    }

    public async getDb() {
        if (!this.db) {
            throw new Error("Database not initialized. Call init method first.");
        }
        return this.db;
    }
}

export default Db;