import { Router } from 'express';

class UserController {
    private db: any;
    private auth: any;
    private wasm: any;
    private dataService: any;
    public router;

    /**
     * @swagger
     * /user/register:
     *   post:
     *     summary: Register a new user
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Successful registration
     *         content:
     *           application/json:
     *             schema: {}
     *       400:
     *         description: Bad request
     *         content:
     *           application/json:
     *             schema: {}
     *       500:
     *         description: Internal Server Error
     *         content:
     *           application/json:
     *             schema: {}
     */
    
    /**
     * @swagger
     * /user/{id}:
     *   get:
     *     summary: Get user by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: User ID
     *     responses:
     *       200:
     *         description: Successful response
     *         content:
     *           application/json:
     *             schema: {}
     *       404:
     *         description: User not found
     *         content:
     *           application/json:
     *             schema: {}
     *       500:
     *         description: Internal Server Error
     *         content:
     *           application/json:
     *             schema: {}
     */
    
    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Get all users
     *     responses:
     *       200:
     *         description: Successful response
     *         content:
     *           application/json:
     *             schema: {}
     *       500:
     *         description: Internal Server Error
     *         content:
     *           application/json:
     *             schema: {}
     */
    
    /**
     * @swagger
     * /user/login:
     *   post:
     *     summary: Login
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Successful login
     *         content:
     *           application/json:
     *             schema: {}
     *       401:
     *         description: Unauthorized
     *         content:
     *           application/json:
     *             schema: {}
     *       500:
     *         description: Internal Server Error
     *         content:
     *           application/json:
     *             schema: {}
     */
    
    /**
     * @swagger
     * /user/{id}:
     *   delete:
     *     summary: Delete user by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: User ID
     *     responses:
     *       200:
     *         description: Successful deletion
     *         content:
     *           application/json:
     *             schema: {}
     *       404:
     *         description: User not found
     *         content:
     *           application/json:
     *             schema: {}
     *       500:
     *         description: Internal Server Error
     *         content:
     *           application/json:
     *             schema: {}
     */
    
    /**
     * @swagger
     * /user/{id}:
     *   put:
     *     summary: Update user by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: User ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Successful update
     *         content:
     *           application/json:
     *             schema: {}
     *       404:
     *         description: User not found
     *         content:
     *           application/json:
     *             schema: {}
     *       500:
     *         description: Internal Server Error
     *         content:
     *           application/json:
     *             schema: {}
     */

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