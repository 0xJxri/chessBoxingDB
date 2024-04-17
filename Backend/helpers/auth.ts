import { ObjectId } from "mongodb";

class AuthHelper {
    private db: any;
    private jwt_rs: any;
    private wasm_singleton: any;
    constructor(client, jwt_rs, wasm_singleton) {
        this.db = client;
        this.jwt_rs = jwt_rs;
        this.wasm_singleton = wasm_singleton;
    }


    async genId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    async register(username, password, res) {
        let resPayload;
        const user = await this.checkIfUserExists(username, password);

        if (user) {
            resPayload = {
                status: "error",
                message: "User already exists",
                code: 400,
                payload: null
            };
        } else {
            try {
                await this.db.collection("users").insertOne({ username: username, password: password });
                const newUser = await this.checkIfUserExists(username, password);
                resPayload = {
                    status: "success",
                    message: "User registered",
                    code: 200,
                    payload: await this.genJwt(newUser._id)
                };
            } catch (error) {
                console.error("Error registering user:", error);
                resPayload = {
                    status: "error",
                    message: "Internal server error",
                    code: 500,
                    payload: null
                };
            }
        }
        res.status(resPayload.code).json(resPayload);
    }

    async getUser(req, res) {
        const id = req.params.id;
        try {
            const user = await this.db.collection("users").findOne({ _id: new ObjectId(id) });
            if (user) {
                res.status(200).json({
                    status: "success",
                    message: "User found",
                    code: 200,
                    payload: user
                });
            } else {
                res.status(404).json({
                    status: "error",
                    message: "User not found",
                    code: 404,
                    payload: null
                });
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).json({
                status: "error",
                message: "Internal server error",
                code: 500,
                payload: null
            });
        }
    }

    async getUsers(req, res) {
        try {
            const users = await this.db.collection("users").find({}, { projection: { _id: 1 } }).toArray();
            if (users.length > 0) {
                res.status(200).json({
                    status: "success",
                    message: "Users found",
                    code: 200,
                    payload: users
                });
            } else {
                res.status(404).json({
                    status: "error",
                    message: "Users not found",
                    code: 404,
                    payload: null
                });
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({
                status: "error",
                message: "Internal server error",
                code: 500,
                payload: null
            });
        }
    }

    async deleteUser(req, res) {
        const id = req.params.id;
        try {
            const deleteCount = await this.db.collection("users").deleteOne({ _id: new ObjectId(id) });
            if (deleteCount.deletedCount > 0) {
                res.status(200).json({
                    status: "success",
                    message: "User deleted",
                    code: 200,
                    payload: null
                });
            } else {
                res.status(404).json({
                    status: "error",
                    message: "User not found",
                    code: 404,
                    payload: null
                });
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).json({
                status: "error",
                message: "Internal server error",
                code: 500,
                payload: null
            });
        }
    }

    async updateUser(req, res) {
        const id = req.params.id;
        const user = req.body;
        try {
            const updateCount = await this.db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: user });
            if (updateCount.modifiedCount > 0) {
                res.status(200).json({
                    status: "success",
                    message: "User updated",
                    code: 200,
                    payload: null
                });
            } else {
                res.status(404).json({
                    status: "error",
                    message: "User not found",
                    code: 404,
                    payload: null
                });
            }
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({
                status: "error",
                message: "Internal server error",
                code: 500,
                payload: null
            });
        }
    }

    async checkIfUserExists(username, password) {
        return await this.db.collection("users").findOne({ username: username, password: password });
    }

    async login(username, password, res) {
        const user = await this.checkIfUserExists(username, password);
        if (user) {
            res.status(200).json({
                status: "success",
                message: "User logged in",
                code: 200,
                payload: await this.genJwt(user._id)
            });
        } else {
            res.status(404).json({
                status: "error",
                message: "User not found",
                code: 404,
                payload: null
            });
        }
    }

    async genJwt(id) {
        const exp = new Date();
        exp.setMinutes(exp.getMinutes() + 60);
        const exp_unix = (exp.getTime() / 1000).toFixed(0);
        const tokenData = { id: id };
        const jwt_rs = await this.wasm_singleton.executeForeignConstructor(await this.wasm_singleton.wasmFunctions["jwt_rs"].jwt_rs, exp_unix, JSON.stringify(tokenData));

        return this.jwt_rs.encode_data(jwt_rs);
    }

    getJwtFromHeaders(req) {

        const authorization = req.headers.authorization;
        if (!authorization || !authorization.startsWith('Bearer ')) return null;
        const jwt = authorization.split(' ')[1];
        return jwt;
    }

    async authorized(req, res, next) {
        const jwt = this.getJwtFromHeaders(req);
        
        try {
            if (!jwt) {
                throw new Error("Invalid token");
            }
            const isValid = await this.jwt_rs.decode_data(jwt);
            if (isValid != "") {
                return isValid;
            } else {
                throw new Error("Invalid token");
            }
        } catch (error) {
            console.error("Error decoding token:", error);
            res.status(401).json({
                status: "error",
                message: " Unauthorized",
                code: 401,
                payload: null
            });
        }
    }
}
export default AuthHelper;
