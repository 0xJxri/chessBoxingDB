import { Router } from 'express';

class UserController {
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
    }

    init() {
        this.router.post("/user/register", async (req, res) => {
            const result = await this.auth.register(req.body.username, req.body.password, res);
            res.status(res.code).json(res.payload);
        });

        this.router.get("/user/:id", async (req, res) => {
            const id = req.params.id;
            const result = await this.auth.getUser(id);
            res.status(res.code).json(result);
        });

        this.router.get("/users", async (req, res) => {
            const result = await this.auth.getUsers();
            res.status(res.code).json(result);
        });

        this.router.post("/user/login", async (req, res) => {
        const result = await this.auth.login(req.body.username, req.body.password, res);

            res.status(res.code).json(result);
        });

        this.router.delete("/user/:id", async (req, res) => {
            const id = req.params.id;
            const result = await this.auth.deleteUser(id);
            res.status(res.code).json(result);
        });

        this.router.put("/user/:id", async (req, res) => {
            const id = req.params.id;
            const value = req.body;
            const result = await this.auth.updateUser(id, value);
            res.status(res.code).json(result);
        });

        return this.router;
    }
}

export default UserController;