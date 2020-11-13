#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Pixel {
    pub r: u8,
    pub g: u8,
    pub b: u8,
    pub a: u8,
}

impl Pixel {
    pub fn set_r(&mut self, val: u8) {
        self.r = val;
    }
    pub fn set_g(&mut self, val: u8) {
        self.g = val;
    }
    pub fn set_b(&mut self, val: u8) {
        self.b = val;
    }
    pub fn set_a(&mut self, val: u8) {
        self.a = val;
    }
}