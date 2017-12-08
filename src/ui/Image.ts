const template = require('./Image.template.html');

import { ImageLoader } from 'services/ImageLoader';
import { RGB, sRGB, Profile, wideGamut, appleRGB } from './../utils/Profiles';
import * as fileSaver from 'file-saver';

export class Image {
    private name: string;
    private image: HTMLImageElement;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private imageData: ImageData;
    private profile: Profile;

    private profileSelect: HTMLSelectElement;
    private gamma: HTMLInputElement;
    private whiteX: HTMLInputElement;
    private whiteY: HTMLInputElement;
    private redX: HTMLInputElement;
    private redY: HTMLInputElement;
    private greenX: HTMLInputElement;
    private greenY: HTMLInputElement;
    private blueX: HTMLInputElement;
    private blueY: HTMLInputElement;

    constructor(name: string, profile: Profile) {
        this.name = name;
        this.initialize();
        this.setProfile(profile);
    }

    public setImage(url: string) {
        return new Promise((resolve, reject) => {
            this.image.onload = () => {
                this.canvas.width = this.image.width;
                this.canvas.height = this.image.height;
                this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
                this.context.drawImage(this.image, 0, 0);
                this.imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
                resolve();
            }
            this.image.src = url;
        });
    }

    public setProfile(profile: Profile) {
        this.profile = profile;
        
        if (this.profile == sRGB) this.profileSelect.selectedIndex = 0;
        else if (this.profile == wideGamut) this.profileSelect.selectedIndex = 1;
        else if (this.profile == appleRGB) this.profileSelect.selectedIndex = 2;

        this.render();
    }

    public getProfile() {
        return new Profile(this.profile.white, this.profile.red, this.profile.green, this.profile.blue, this.profile.gamma);
    }

    public getImageSource() {
        return this.image.src;
    }

    public downloadImage() {
        this.canvas.toBlob((blob) => {
            if (blob != null)
                fileSaver.saveAs(blob, "image-processed.png");
        });
    }

    public convertToProfile(toProfile: Profile) {
        let from = this.profile;
        let to = toProfile;
        let data = this.imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            let fromRGB: RGB = { R: data[i], G: data[i+1], B: data[i+2] };
            let XYZ = from.toXYZ(fromRGB);
            let toRGB = to.toRGB(XYZ);

            data[i] = toRGB.R;
            data[i+1] = toRGB.G;
            data[i+2] = toRGB.B;
        }

        this.context.putImageData(this.imageData, 0, 0);
    }

    private initialize() {
        let images = <HTMLDivElement> document.getElementById('images');
        let imageContainer = document.createElement('div');
        imageContainer.innerHTML = template;
        
        let name = <HTMLHeadElement> imageContainer.getElementsByClassName('image-name')[0];
        name.innerHTML = this.name;

        this.profileSelect = <HTMLSelectElement> imageContainer.getElementsByClassName('profile')[0];
        this.profileSelect.onchange = (e: any) => {
            let profile = e.target.value;
            if (profile == "sRGB")
                this.setProfile(sRGB);
            else if (profile == "wideGamut")
                this.setProfile(wideGamut);
            else if (profile == "appleRGB")
                this.setProfile(appleRGB);
        }

        this.image = <HTMLImageElement> imageContainer.getElementsByClassName('image')[0];
        this.canvas = <HTMLCanvasElement> imageContainer.getElementsByClassName('canvas')[0];
        this.gamma = <HTMLInputElement> imageContainer.getElementsByClassName('gamma')[0];
        this.whiteX = <HTMLInputElement> imageContainer.getElementsByClassName('white-x')[0];
        this.whiteY = <HTMLInputElement> imageContainer.getElementsByClassName('white-y')[0];
        this.redX = <HTMLInputElement> imageContainer.getElementsByClassName('red-x')[0];
        this.redY = <HTMLInputElement> imageContainer.getElementsByClassName('red-y')[0];
        this.greenX = <HTMLInputElement> imageContainer.getElementsByClassName('green-x')[0];
        this.greenY = <HTMLInputElement> imageContainer.getElementsByClassName('green-y')[0];
        this.blueX = <HTMLInputElement> imageContainer.getElementsByClassName('blue-x')[0];
        this.blueY = <HTMLInputElement> imageContainer.getElementsByClassName('blue-y')[0];
        
        let inputs = [this.gamma, this.whiteX, this.whiteY, this.redX, this.redY, this.greenX, this.greenY, this.blueX, this.blueY];

        for (let input of inputs) {
            input.onchange = () => {
                let gamma = Number(this.gamma.value);
                let whiteX = Number(this.whiteX.value);
                let whiteY = Number(this.whiteY.value);
                let whiteZ = 1 - whiteX - whiteY;
                let redX = Number(this.redX.value);
                let redY = Number(this.redY.value);
                let redZ = 1 - redX - redY;
                let greenX = Number(this.greenX.value);
                let greenY = Number(this.greenY.value);
                let greenZ = 1 - greenX - greenY;
                let blueX = Number(this.blueX.value);
                let blueY = Number(this.blueY.value);
                let blueZ = 1 - blueX - blueY;

                this.profile = new Profile(
                    { X: whiteX, Y: whiteY, Z: whiteZ },
                    { X: redX, Y: redY, Z: redZ },
                    { X: greenX, Y: greenY, Z: greenZ },
                    { X: blueX, Y: blueY, Z: blueZ },
                    gamma
                )
            }
        }
        
        images.appendChild(imageContainer);
    }

    private render() {
        this.gamma.value = this.profile.gamma.toString();
        this.whiteX.value = this.profile.white.X.toString();
        this.whiteY.value = this.profile.white.Y.toString();
        this.redX.value = this.profile.red.X.toString();
        this.redY.value = this.profile.red.Y.toString();
        this.greenX.value = this.profile.green.X.toString();
        this.greenY.value = this.profile.green.Y.toString();
        this.blueX.value = this.profile.blue.X.toString();
        this.blueY.value = this.profile.blue.Y.toString();
    }
}