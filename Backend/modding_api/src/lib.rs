use wasm_bindgen::prelude::*;
use qrcode_generator::QrCodeEcc;


#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}





