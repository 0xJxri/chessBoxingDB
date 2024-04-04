import {
  Context,
  Router
} from "@oakserver/oak";

class UserController {
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

        this.router.post("/user/register", async (context: Context) => {
          const body = await context.request.body();
          const value = await body.value;
          context.response.body =  await this.auth.register(value.username, value.password)
          context.response.status = context.response.body.code;
        });

        this.router.get("/user/:id", async (context: Context) => {
          const id = context.params.id;
          context.response.body =  await this.auth.getUser(id);
          context.response.status = context.response.body.code;
        });

        this.router.get("/users", async (context: Context) => {
          context.response.body =  await this.auth.getUsers();
          context.response.status = context.response.body.code;
        });

        this.router.post("/user/login", async (context: Context) => {
          const body = await context.request.body();
          const value = await body.value;
          context.response.body =  await this.auth.login(value.username, value.password)
          context.response.status = context.response.body.code;
        });

        this.router.delete("/user:id", async (context: Context) => {
          const id = context.params.id;
          context.response.body =  await this.auth.deleteUser(id);
          context.response.status = context.response.body.code;
        });

        this.router.put("/user/:id", async (context: Context) => {
          const id = context.params.id;
          const body = await context.request.body();
          const value = await body.value;
          context.response.body =  await this.auth.updateUser(id, value);
          context.response.status = context.response.body.code;
        });

        return this.router.routes();
    }
    //  the CIA glows in the dark
}

export default UserController;