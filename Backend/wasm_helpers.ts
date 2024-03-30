import * as fs from 'fs/promises';    

async function readJsonFile(filePath) {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
}
class WasmSingleton {
    private initialized: boolean;
    private wasmModule: any = [];
    public wasmFunctions= {};
    private result: any;



    constructor() {
        this.initialized = false;
    }

    async loadFunctionsFromModule(modulePath) {
        const module = await import(modulePath);
        const functions = {};

        for (const key in module) {
            if (typeof module[key] === "function"){
                functions[key] = module[key];
            }

        }
        return functions;
    }

    async init() {
        if (!this.initialized) {
            const modules = await readJsonFile("./mods.json"); 
            for(const module of modules) {
                    this.wasmFunctions[module.name] = await this.loadFunctionsFromModule(module.path);
                    this.wasmModule[module.name] = await this.executeForeign(this.wasmFunctions[module.name].default);
            };
        }
        console.log("Wasm modules initialized");
        this.initialized = true;

    }
    

    async executeWasmFunction(wasmFunction, ...args) {
        return wasmFunction(...args);


    }

    public async executeForeign(wasmFunction, ...args) {
            
        await this.executeWasmFunction(wasmFunction, ...args).then(result => {
            this.result = result;
          })
          .catch(error => {
             this.result = "Error executing WebAssembly function: " + error;
        });

        return wasmSingleton
    }

    public async executeForeignConstructor(constructor, ...args) {
        try {
            const instance = new constructor(...args);
            return instance;
        } catch (error) {
            return "Error executing constructor: " + error;
        }
    }

    public getRawResult() {
        return this.result;
    }

    public decodeU8ToString() {
        return new TextDecoder().decode(this.result);
    }

}

const wasmSingleton = new WasmSingleton();
export default wasmSingleton;