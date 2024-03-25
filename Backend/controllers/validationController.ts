import {
  Context,
  Router
} from "https://deno.land/x/oak@v12.4.0/mod.ts";


class ValidationController {
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
        this.router.get("/validate", async (context: Context) => {
          let jwt = await this.auth.authorized(context);

            context.response.status = 401;
            context.response.body = {
                status: "error",
                message: "User is not authorized",
                code: 401,
                payload: null
            }


          if(jwt) {
              context.response.status = 200;
              context.response.body = {
                  status: "success",
                  message: "User is authorized",
                  code: 200,
                  payload: null
              }
          }
      });

        return this.router.routes();
    }
}

export default ValidationController;