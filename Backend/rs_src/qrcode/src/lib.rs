use wasm_bindgen::prelude::*;
use qrcode_generator::QrCodeEcc;


#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}


#[wasm_bindgen]
pub fn generateQr(jwt: &str) -> Vec<u8> {
    return qrcode_generator::to_svg_to_string(jwt, QrCodeEcc::Low, 1024, None::<&str>).unwrap().into_bytes();
}