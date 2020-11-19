use crate::pixel::Pixel;
use std::option::Option;
use wasm_bindgen::prelude::*;

const GRID_PIXEL_DARK: Pixel = Pixel {
    r: 204,
    g: 204,
    b: 204,
    a: 255,
};
const GRID_PIXEL_LIGHT: Pixel = Pixel {
    r: 255,
    g: 255,
    b: 255,
    a: 255,
};
const TRANSPARENT_PIXEL: Pixel = Pixel {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
};

#[wasm_bindgen]
pub struct PixelSpace {
    width: u32,
    height: u32,
    pixels: Vec<Pixel>,
    grid: Vec<Pixel>,
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

fn get_position(index: u32, width: u32) -> [u32; 2] {
    let x = index % width;
    let y = index / width;

    [x, y]
}

#[wasm_bindgen]
impl PixelSpace {
    pub fn new(width: Option<u32>, height: Option<u32>) -> PixelSpace {
        let width = width.unwrap_or(64);
        let height = height.unwrap_or(64);

        let pixels = (0..width * height).map(|_| TRANSPARENT_PIXEL).collect();

        let grid = (0..width * height)
            .map(|i| match get_position(i, width) {
                [x, y] if x % 2 == 0 && y % 2 == 0 => GRID_PIXEL_DARK,
                [x, y] if x % 2 != 0 && y % 2 != 0 => GRID_PIXEL_DARK,
                [..] => GRID_PIXEL_LIGHT,
            })
            .collect();
        PixelSpace {
            width,
            height,
            pixels,
            grid,
        }
    }

    pub fn erase(&mut self, row: u32, col: u32) {
        self.paint(
            row,
            col,
            Pixel {
                r: 255,
                g: 255,
                b: 255,
                a: 0,
            },
        )
    }

    pub fn paint(&mut self, row: u32, col: u32, pixel: Pixel) {
        let idx = self.get_index(row, col);

        match idx {
            Some(id) => {
                self.pixels[id] = pixel;
            }
            None => {}
        }
    }

    pub fn bucket(&mut self, row: u32, col: u32, pixel: Pixel) {
        self.paint(row, col, pixel);

        let n = self.get_index(row - 1, col);
        let e = self.get_index(row, col + 1);
        let s = self.get_index(row + 1, col);
        let w = self.get_index(row, col - 1);

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

    pub fn grid(&self) -> *const Pixel {
        self.grid.as_ptr()
    }
}
