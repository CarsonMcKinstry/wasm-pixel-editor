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
    fn get_index(&self, row: u32, col: u32) -> Option<usize> {

        if row >= self.height || col >= self.width || row < 0 || col < 0 {
            None
        } else {
            Some((row * self.width + col) as usize)
        }

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

    pub fn erase(&mut self, row: u32, col: u32) {
        self.paint(row, col, Pixel {
            r: 255,
            g: 255,
            b: 255,
            a: 0
        })
    }

    pub fn paint(&mut self, row: u32, col: u32, pixel: Pixel) {
        let idx = self.get_index(row, col);

        match idx {
            Some(id) => {
                self.pixels[id] = pixel;
            },
            None => {}
        }
    }

    pub fn bucket(&mut self, row: u32, col: u32, pixel: Pixel ) {

        self.paint(row, col, pixel);

        let n = self.get_index(row - 1,     col);
        let e = self.get_index(row    , col + 1);
        let s = self.get_index(row + 1,     col);
        let w = self.get_index(row    , col - 1);


        match n {
            Some(id) => {
                let current_pix = self.pixels[id];
                if current_pix != pixel {
                    self.pixels[id] = pixel;
                    self.bucket(row - 1, col, pixel);
                }
            }
            None => {}
        }
        match e {
            Some(id) => {
                let current_pix = self.pixels[id];
                if current_pix != pixel {
                    self.pixels[id] = pixel;
                    self.bucket(row, col + 1, pixel);
                }
            }
            None => {}
        }
        match s {
            Some(id) => {
                let current_pix = self.pixels[id];
                if current_pix != pixel {
                    self.pixels[id] = pixel;
                    self.bucket(row + 1, col, pixel);
                }
            }
            None => {}
        }
        match w {
            Some(id) => {
                let current_pix = self.pixels[id];
                if current_pix != pixel {
                    self.pixels[id] = pixel;
                    self.bucket(row, col - 1, pixel);
                }
            }
            None => {}
        }
    }

    pub fn pixels(&self) -> *const Pixel {
        self.pixels.as_ptr()
    }
}