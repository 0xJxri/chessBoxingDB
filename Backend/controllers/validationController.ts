import { Router } from 'express';

class ValidationController {
    private db: any;
    private auth: any;
    private wasm: any;
    private dataService: any;
    public router;
    constructor(db, auth, wasm) {
        this.db = db;
        this.auth = auth;
        this.wasm = wasm;
        this.router = Router();
        this.init();
    }

    init() {
        this.router.get("/validate", async (req, res) => {
            try {
                let jwt = await this.auth.authorized(req);

                if (jwt) {
                    res.status(200).json({
                        status: "success",
                        message: "User is authorized",
                        code: 200,
                        payload: null
                    });
                } else {
                    res.status(401).json({
                        status: "error",
                        message: "User is not authorized",
                        code: 401,
                        payload: null
                    });
                }
            } catch (error) {
                console.error("Error occurred:", error);
                res.status(500).json({
                    status: "error",
                    message: "Internal Server Error",
                    code: 500,
                    payload: null
                });
            }
        });
        return this.router;

    }
}

export default ValidationController;
