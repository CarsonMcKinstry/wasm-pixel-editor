use wasm_bindgen::prelude::*;
use crate::pixel::Pixel;
use std::option::Option;

#[wasm_bindgen]
pub struct PixelSpace {
    width: u32,
    height: u32,
    pixels: Vec<Pixel>
}

impl PixelSpace {
    fn get_index(&self, row: u32, col: u32) -> usize {
        (row * self.width + col) as usize
    }
    
}

#[wasm_bindgen]
impl PixelSpace {
    
    pub fn new(width: Option<u32>, height: Option<u32>) -> PixelSpace {

        let width = width.unwrap_or(64);
        let height = height.unwrap_or(64);

        let pixels = (0..width * height)
            .map(|_| {
                Pixel {
                    r: 255,
                    g: 255,
                    b: 255,
                    a: 0
                }
            })
            .collect();
        
        PixelSpace {
            width,
            height,
            pixels
        }
    }

    pub fn paint(&mut self, row: u32, col: u32, r: u8, g: u8, b: u8, a: u8) {
        let idx = self.get_index(row, col);

        self.pixels[idx] = Pixel {
            r,
            g,
            b,
            a
        }
    }

    pub fn pixels(&self) -> *const Pixel {
        self.pixels.as_ptr()
    }
}