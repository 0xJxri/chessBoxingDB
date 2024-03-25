use wasm_bindgen::prelude::*;
use jsonwebtoken::{encode, decode, Header, Algorithm, Validation, EncodingKey, DecodingKey};
use serde::{Deserialize, Serialize};
use std::time::{SystemTime};
use js_sys::Date;
use web_sys::console;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}


#[wasm_bindgen]
pub struct jwt_rs_methods {
    secret: String,
}


#[wasm_bindgen]
#[derive(Debug, Serialize, Deserialize)]
pub struct jwt_rs {
    exp: usize,
    data: String,
}



#[wasm_bindgen]
impl jwt_rs {
    #[wasm_bindgen(constructor)]
    pub fn new(exp: usize, data: String) -> jwt_rs {
        jwt_rs {
            exp,
            data
        }
    }

    #[wasm_bindgen(getter)]
    pub fn data(&self) -> String {
        self.data.clone()
    }

    #[wasm_bindgen(setter)]
    pub fn set_data(&mut self, data: String) {
        self.data = data;
    }
}


#[wasm_bindgen]
impl jwt_rs_methods {
    #[wasm_bindgen(constructor)]
    pub fn new(secret: String) -> jwt_rs_methods {
        jwt_rs_methods {
            secret
        }
    }

    #[wasm_bindgen(getter)]
    pub fn secret(&self) -> String {
        self.secret.clone()
    }

    #[wasm_bindgen(setter)]
    pub fn set_secret(&mut self, secret: String) {
        self.secret = secret;
    }

    #[wasm_bindgen]
    pub fn encode_data(&self, data: jwt_rs) -> String {
        let header = Header::new(Algorithm::HS512);
        let token = encode(&header, &data, &EncodingKey::from_secret(self.secret.as_ref())).unwrap();

        token
    }



    #[wasm_bindgen]
    pub fn decode_data(&self, token: &str) -> String {
        let decoded_token = match decode::<jwt_rs>(&token, &DecodingKey::from_secret(self.secret.as_ref()), &Validation::new(Algorithm::HS512)) {
            Ok(token_data) => {
 //                   log(&format!("{:?}", serde_json::to_string(&token_data.claims).unwrap()));
                    return serde_json::to_string(&token_data.claims).unwrap();
            }
            Err(e) => {
                log(&format!("{:?}", e));
                return String::from("");
            }
        };
    }
}
