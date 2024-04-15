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
