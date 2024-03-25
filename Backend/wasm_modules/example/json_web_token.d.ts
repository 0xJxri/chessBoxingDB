/* tslint:disable */
/* eslint-disable */
/**
*/
export class jwt_rs {
  free(): void;
/**
* @param {number} exp
* @param {string} data
*/
  constructor(exp: number, data: string);
/**
*/
  data: string;
}
/**
*/
export class jwt_rs_methods {
  free(): void;
/**
* @param {string} secret
*/
  constructor(secret: string);
/**
* @param {jwt_rs} data
* @returns {string}
*/
  encode_data(data: jwt_rs): string;
/**
* @param {string} token
* @returns {string}
*/
  decode_data(token: string): string;
/**
*/
  secret: string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_jwt_rs_methods_free: (a: number) => void;
  readonly __wbg_jwt_rs_free: (a: number) => void;
  readonly jwt_rs_new: (a: number, b: number, c: number) => number;
  readonly jwt_rs_data: (a: number, b: number) => void;
  readonly jwt_rs_methods_new: (a: number, b: number) => number;
  readonly jwt_rs_methods_set_secret: (a: number, b: number, c: number) => void;
  readonly jwt_rs_methods_encode_data: (a: number, b: number, c: number) => void;
  readonly jwt_rs_methods_decode_data: (a: number, b: number, c: number, d: number) => void;
  readonly jwt_rs_set_data: (a: number, b: number, c: number) => void;
  readonly jwt_rs_methods_secret: (a: number, b: number) => void;
  readonly ring_core_0_17_8_bn_mul_mont: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
