import * as math from 'mathjs';

export interface XYZ {
    X: number;
    Y: number;
    Z: number;
}

export interface RGB {
    R: number;
    G: number;
    B: number;
}

export class Profile {
    gamutMatrix: mathjs.Matrix;
    gamutInverseMatrix: mathjs.Matrix;
    S: mathjs.Matrix;
    toXYZMatrix: mathjs.Matrix;
    fromXYZMatrix: mathjs.Matrix;
    white: XYZ;
    whiteMatrix: number[];
    red: XYZ;
    green: XYZ;
    blue: XYZ;
    gamma: number;

    constructor(white: XYZ, red: XYZ, green: XYZ, blue: XYZ, gamma: number) {
        this.white = white;
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.gamma = gamma;

        this.whiteMatrix = [this.white.X / this.white.Y, 1, (1 - this.white.X - this.white.Y) / this.white.Y];
        this.gamutMatrix = this.createGamut();
        this.gamutInverseMatrix = math.inv(this.gamutMatrix) as mathjs.Matrix;
        this.S = math.multiply(this.gamutInverseMatrix, this.whiteMatrix);
        this.toXYZMatrix = this.createToXYZ();
        this.fromXYZMatrix = math.inv(this.toXYZMatrix) as mathjs.Matrix;
    }

    // from profile to profile (przyjmuje dwa profile, obrazek, dla kazdego piksela bierze kolor uzywa toXYZ,a potem toRGB)
    
    toXYZ(RGB: RGB): XYZ {
        let r = math.pow(RGB.R / 255, this.gamma) as number;
        let g = math.pow(RGB.G / 255, this.gamma) as number;
        let b = math.pow(RGB.B / 255, this.gamma) as number;

        let XYZ = math.multiply(this.toXYZMatrix, [r, g, b]);

        return { X: XYZ.get([0]), Y: XYZ.get([1]), Z: XYZ.get([2]) };
    }

    toRGB(XYZ: XYZ): RGB {
        let RGB = math.multiply(this.fromXYZMatrix, [XYZ.X, XYZ.Y, XYZ.Z]);

        let r = RGB.get([0]);
        let g = RGB.get([1]);
        let b = RGB.get([2]);

        r = math.pow(r, this.gamma) as number * 255;
        g = math.pow(g, this.gamma) as number * 255;
        b = math.pow(b, this.gamma) as number * 255;

        return { R: r, G: g, B: b };
    }

    createToXYZ() {
        let Sr = this.S.get([0]);
        let Sg = this.S.get([1]);
        let Sb = this.S.get([2]);
    
        return math.matrix([
            [Sr * this.red.X, Sg * this.green.X, Sb * this.blue.X],
            [Sr * this.red.Y, Sg * this.green.Y, Sb * this.blue.Z],
            [Sr * this.red.Z, Sg * this.green.Z, Sb * this.blue.Z],
        ]);
    }

    createGamut() {
        return math.matrix([
            [this.red.X, this.green.X, this.blue.X],
            [this.red.Y, this.green.Y, this.blue.Y],
            [this.red.Z, this.green.Z, this.blue.Z],
        ])
    }
}

export var sRGB = new Profile(
    { X: 0.3127, Y: 0.3290, Z: 0.3583 },
    { X: 0.64, Y: 0.33, Z: 0.03 },
    { X: 0.3, Y: 0.6, Z: 0.1 },
    { X: 0.15, Y: 0.06, Z: 0.79 },
    2.2
);

export var wideGamut = new Profile(
    { X: 0.3457, Y: 0.3585, Z: 0.2958 },
    { X: 0.7347, Y: 0.2653, Z: 0 },
    { X: 0.1152, Y: 0.8264, Z: 0.0584 },
    { X: 0.1566, Y: 0.0177, Z: 0.8257 },
    1.2
);

export var appleRGB = new Profile(
    { X: 0.3127, Y: 0.3290, Z: 0.3583 },
    { X: 0.6250, Y: 0.3400, Z: 0.0350 },
    { X: 0.2800, Y: 0.5950, Z: 0.1250 },
    { X: 0.1550, Y: 0.0700, Z: 0.7750 },
    1.8
)