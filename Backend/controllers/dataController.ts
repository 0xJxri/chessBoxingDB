import {
    Router
} from "https://deno.land/x/oak@v12.4.0/mod.ts";



class DataController {
    private db;
    private auth;
    private wasm;
    public router; 

    constructor(db, auth, wasm) {
        this.db = db;
        this.auth = auth;
        this.wasm = wasm;
        this.router = new Router();
    }


    public async init() {

        // TODO fare le rotte
        return this.router.routes();
    }
}

export default DataController;