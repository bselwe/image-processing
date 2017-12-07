const template = require('./Image.template.html');

import { ImageLoader } from 'services/ImageLoader';

export class Image {
    private image: HTMLImageElement;
    private name: string;

    constructor(name: string) {
        this.name = name;

        this.render();
    }

    public async setImage(url: string) {
        this.image.src = url;
    }

    private render() {
        let images = <HTMLDivElement> document.getElementById('images');
        let imageContainer = document.createElement('div');
        imageContainer.innerHTML = template;
        this.image = <HTMLImageElement> imageContainer.getElementsByClassName('image')[0];
        var name = <HTMLHeadElement> imageContainer.getElementsByClassName('image-name')[0];
        name.innerHTML = this.name;
        images.appendChild(imageContainer);
    }
}