import fs from 'fs/promises';

class WasmSingleton {
    private initialized: boolean;
    private wasmModule: any;
    private wasmFunctions: any;
    private result: any;

    constructor() {
        this.initialized = false;
        this.wasmModule = {};
        this.wasmFunctions = {};
        this.result = undefined;
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
            const modules = JSON.parse(await fs.readFile("./mods.json", "utf8"));
            for(const module of modules) {
                this.wasmFunctions[module.name] = await this.loadFunctionsFromModule(module.path);
                this.wasmModule[module.name] = await this.executeForeign(this.wasmFunctions[module.name].default);
            }
        }
        console.log("Wasm modules initialized");
        this.initialized = true;
    }

    async executeWasmFunction(wasmFunction, ...args) {
        return wasmFunction(...args);
    }

    async executeForeign(wasmFunction, ...args) {
        try {
            const result = await this.executeWasmFunction(wasmFunction, ...args);
            this.result = result;
        } catch (error) {
            this.result = "Error executing WebAssembly function: " + error;
        }
        return this.result;
    }

    async executeForeignConstructor(constructor, ...args) {
        try {
            const instance = new constructor(...args);
            return instance;
        } catch (error) {
            return "Error executing constructor: " + error;
        }
    }

    getRawResult() {
        return this.result;
    }

    decodeU8ToString() {
        return new TextDecoder().decode(this.result);
    }
}

const wasmSingleton = new WasmSingleton();
export default wasmSingleton;
