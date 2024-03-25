import {
    MongoClient
} from "https://deno.land/x/mongo@v0.32.0/mod.ts";


class Db {
    private db: MongoClient;
    
    constructor(host){
        let client =  new MongoClient();
        console.log(host);
        this.db = client.connect(host);

        console.log(this.db)
        console.log("Connected to db");
    }

    public async getDb(){
        return this.db;
    }



}

export default Db;