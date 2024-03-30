import { Context } from "@oakserver/oak";
import Db from "./db.ts";
import ResponsePayload from "./responsePayload.ts";

class AuthHelper {
    private db: Db;
    private jwt_rs: any;
    private wasm_singleton: any;

    constructor(client, jwt_rs, wasm_singleton) {
        this.db = client;
        this.jwt_rs = jwt_rs;
        this.wasm_singleton = wasm_singleton;
    }

    public async genId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    public async register(username: string, password: string){

        let res: ResponsePayload;
        const user = await this.checkIfUserExists(username, password);

        if (user) {
            return {
                status: "error",
                message: "User already exists",
                code: 400,
                payload: null
            };
        }

        try {

            this.db.getDb().then(db => {
                db.collection("users").insertOne({username: username, password: password});
            });

            const new_user = await this.checkIfUserExists(username, password);
            
            console.log(new_user);

            res = {
                status: "success",
                message: "User registered",
                code: 200,
                payload: await this.genJwt(new_user._id)
            };

        } catch (e) {

             res = {
                status: "error",
                message: e,
                code: 500,
                payload: null
            };
        }
        return res;

    }

    public async getUser(id: string) {
        console.log(id);
        const user = await this.db.getDb().then(db => {
            return db.collection("users").findOne({_id: new ObjectId(id)}); 
        });

        if (user) {
            return {
                status: "success",
                message: "User found",
                code: 200,
                payload: user
            };
        }

        return {
            status: "error",
            message: "User not found",
            code: 404,
            payload: null
        };
    }

    public async getUsers() {
        try {
            const db = await this.db.getDb();
            
            const usersCursor = db.collection("users").find({}, { projection: { _id: 1 } });
            const users = await usersCursor.toArray();

            if (users.length > 0) {
                return {
                    status: "success",
                    message: "Users found",
                    code: 200,
                    payload: users
                };
            } else {
                return {
                    status: "error",
                    message: "Users not found",
                    code: 404,
                    payload: null
                };
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            return {
                status: "error",
                message: "Internal server error",
                code: 500,
                payload: null
            };
        }
    }

    public async deleteUser(id: string) {
        try {
            const db = await this.db.getDb();
            const deleteCount = await db.collection("users").deleteOne({ _id: new ObjectId(id) });

            if (deleteCount > 0) {
                return {
                    status: "success",
                    message: "User deleted",
                    code: 200,
                    payload: null
                };
            } else {
                return {
                    status: "error",
                    message: "User not found",
                    code: 404,
                    payload: null
                };
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            return {
                status: "error",
                message: "Internal server error",
                code: 500,
                payload: null
            };
        }
    }

    public async updateUser(id: string, user: any) {
        try {
            const db = await this.db.getDb();
            const updateCount = await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: user });

            if (updateCount > 0) {
                return {
                    status: "success",
                    message: "User updated",
                    code: 200,
                    payload: null
                };
            } else {
                return {
                    status: "error",
                    message: "User not found",
                    code: 404,
                    payload: null
                };
            }
        } catch (error) {
            console.error("Error updating user:", error);
            return {
                status: "error",
                message: "Internal server error",
                code: 500,
                payload: null
            };
        }
    }

    public async checkIfUserExists(username: string, password: string) {

        const user = await this.db.getDb().then(db => {
            return db.collection("users").findOne({username: username, password: password});
        });

        if (user) {
            return user;
        }

        return null;

    }

    public async login(username: string, password: string) {

        const user = await this.checkIfUserExists(username, password);

            if (user) {

            return {
                status: "success",
                message: "User logged in",
                code: 200,
                payload: await this.genJwt(user.id)
            };
        } else {

            return {
                status: "error",
                message: "User not found",
                code: 404,
                payload: null
            }

        }
    }
    

    public async genJwt(id) {
        // exp: (exp.getTime() / 1000).toFixed(0)
        const exp = new Date();
        exp.setMinutes(exp.getMinutes() + 1);


        const exp_unix = (exp.getTime() / 1000).toFixed(0);
        const tokenData = { id: id  };
        const jwt_rs =await this.wasm_singleton.executeForeignConstructor(await this.wasm_singleton.wasmFunctions["jwt_rs"].jwt_rs, exp_unix, JSON.stringify(tokenData));

        return this.jwt_rs.encode_data(jwt_rs);
    }

    public getJwtFromHeaders(ctx: Context) {
        const headers: Headers = ctx.request.headers;
        const authorization = headers.get('Authorization');
        if (!authorization) {
            ctx.response.status = 401;
            return;
        }
        const jwt = authorization.split(' ')[1];
        return jwt;
    }

    public authorized = async (ctx: Context) => {
        const jwt = this.getJwtFromHeaders(ctx);
        try {
            if (!jwt) {
                ctx.response.status = 401;
                return;
            }
            const isValid = await this.jwt_rs.decode_data(jwt);

            if (isValid != "") {
                return jwt;
            } else {
                throw new Error("Invalid token");
            }
        } catch (error) {
            ctx.response.status = 401;
            return;
        }
    };

}

export default AuthHelper;
